variable "access_key" {
  description = "aws access key"
}

variable "secret_key" {
  description = "aws secret key"
}

variable "aws_region" {
  description = "AWS region to launch servers."
  default     = "eu-central-1"
}


variable "eks_cluster_name" {
  description = "cluster name"
  default     = "remotify"
}

variable "db_identifier" {
  description = "db identifer"
  default     = "remotify"
}

variable "db_instance_class" {
  description = "mashine type to be used"

  default = {
    production = "db.t2.micro"
    testing  = "db.t2.micro"
  }
}
variable "worker_group_1_instance_type" {
  description = "mashine type to be used"

  default = {
    production = "t2.medium"
    testing  = "t2.micro"
  }
}

variable "db_username" {
  description = "db username"
}

variable "db_password" {
  description = "db password"
}

variable "private_subnets" {
  default = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}