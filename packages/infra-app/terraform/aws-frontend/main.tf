terraform {
  required_version = ">= 0.14.9"
}


provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.aws_region}"
}

module "s3_bucket" {
  source = "./s3_bucket"
}

