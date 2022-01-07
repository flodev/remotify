variable "do_token" {
  description = "aws access key"
}

variable "pvt_key" {
  description = "aws secret key"
}

variable "do_region" { default="fra1" }

variable "k8s_cluster_name" {
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

variable "db_username" {
  description = "db username"
}

variable "db_password" {
  description = "db password"
}

variable do_vpc_cidr { default="10.10.10.0/24" }

variable k8s_version_prefix { default="1.21." }