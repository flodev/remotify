terraform {
  required_version = ">= 0.14.9"
}

locals {
  cluster_name = "eks-${var.eks_cluster_name}-${terraform.workspace}"
}

provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.aws_region}"
}


# data "aws_eks_cluster" "cluster" {
#   name = module.eks.cluster_id
#   depends_on = [
#     aws_eks_cluster
#   ]
# }

# data "aws_eks_cluster_auth" "cluster" {
#   name = module.eks.cluster_id
# }

# data "aws_availability_zones" "available" {
# }

# data "aws_eks" "worker_security_group_id" {
#   name = module.eks.worker_security_group_id
# }

# data "aws_vpc" "id" {
#   vpc_id = module.vpc.vpc_id
# }

data "aws_subnet_ids" "all" {
  vpc_id = module.vpc.vpc_id
  depends_on = [
    module.vpc
  ]
}

data "aws_subnet_ids" "private" {
  vpc_id = module.vpc.vpc_id
  depends_on = [
    module.vpc
  ]
}


module "s3_bucket" {
  source = "./s3_bucket"
}

module "vpc" {
  source = "./vpc"
  private_subnets = var.private_subnets
  cluster_name = local.cluster_name
}

module "ecr_respositories" {
  source = "./ecr_repositories"
}

module "eks" {
  source = "./eks"
  vpc_id = module.vpc.vpc_id
  cluster_name = local.cluster_name
  private_subnets = module.vpc.private_subnets
  worker_group_1_instance_type = var.worker_group_1_instance_type[terraform.workspace]
}

module "db" {
  source = "./db"
  db_identifier = var.db_identifier
  cluster_id = module.eks.cluster_id
  vpc_id = module.vpc.vpc_id
  eks_worker_security_group_id = module.eks.worker_security_group_id
  private_aws_subnet_ids = data.aws_subnet_ids.private.ids
  db_instance_class = var.db_instance_class[terraform.workspace]
  db_username = var.db_username
  db_password = var.db_password
}
