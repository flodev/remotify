#####
# DB
#####

resource "aws_security_group" "sec_grp_rds" {
  name_prefix = var.cluster_id
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "remotify-rds-postgres-security-group"
    Environment = terraform.workspace
  }
}


resource "aws_security_group_rule" "allow-workers-nodes-communications" {
  description              = "Allow worker nodes to communicate with database"
  from_port                = 5432
  protocol                 = "tcp"
  security_group_id        = "${aws_security_group.sec_grp_rds.id}"
  source_security_group_id = var.eks_worker_security_group_id
  to_port                  = 5432
  type                     = "ingress"
}

module "db" {
  source = "terraform-aws-modules/rds/aws"

  identifier = var.db_identifier

  engine            = "postgres"
  engine_version    = "11.10"
  instance_class    = var.db_instance_class
  allocated_storage = 10
  storage_encrypted = false

  # kms_key_id        = "arm:aws:kms:<region>:<account id>:key/<kms key id>"
  name = "remotify"

  # NOTE: Do NOT use 'user' as the value for 'username' as it throws:
  # "Error creating DB Instance: InvalidParameterValue: MasterUsername
  # user cannot be used as it is a reserved word used by the engine"
  username = "${var.db_username}"
  password = "${var.db_password}"
  port     = "5432"

  vpc_security_group_ids = [aws_security_group.sec_grp_rds.id]

  maintenance_window = "Mon:00:00-Mon:03:00"
  backup_window      = "03:00-06:00"

  # disable backups to create DB faster
  backup_retention_period = 0

  tags = {
    Name       = "remotify app db"
    Environment = terraform.workspace
  }

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  # DB subnet group
  subnet_ids = var.private_aws_subnet_ids

  # DB parameter group
  family = "postgres11"

  # DB option group
  major_engine_version = "11"

  # Snapshot name upon DB deletion
  final_snapshot_identifier = "remotify-snapshot"

  # Database Deletion Protection
  deletion_protection = false
}