
# things todo manually
## attach additional s3full access manually
attach s3full access policy to role with policy AmazonEKSWorkerNodePolicy (probably named eks-remotify-<ENVIRONMENT><RANDOM_NUMBER>)

## assign ssl manually to LB

after creating a load balancer svc the ssl cert needs to be attached to lb
go to ec2 -> your lb -> listerns tab -> change listeners -> select secure tcp on 443 port -> select cert