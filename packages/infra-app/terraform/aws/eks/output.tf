output "cluster_id" {
  value = module.eks.cluster_id
}
output "worker_security_group_id" {
  value = module.eks.worker_security_group_id
}