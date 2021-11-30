# remotify kubernetes instructions

## change kubernetes env to aws
`aws eks --region eu-west-1 update-kubeconfig --name eks-remotify-production`

## deploy container  

source .env && envsubst < deployment.yaml | kubectl apply -f -

# install pgadmin
https://github.com/helm/charts/tree/master/stable/pgadmin
* helm install pgadmin-new stable/pgadmin

 kubectl port-forward pgadmin-new-d89db8d-2lv56 8050:80


# push local docker to ecr

## auth

docker build -t <ECR-REPOSITORY-URI>:<TAG> . 
docker build -t 002172820271.dkr.ecr.eu-west-1.amazonaws.com/auth:0.1.5 . 

### Run Docker Image locally & Test
docker run --name <name-of-container> -p 80:80 --rm -d <ECR-REPOSITORY-URI>:<TAG>
docker run --name auth -p 80:80 --rm -d 002172820271.dkr.ecr.eu-west-1.amazonaws.com/auth:0.1.5
(docker run -d <IMAGE_HASH>)

### Get Login Password
docker login -u AWS -p $(aws ecr get-login-password --region eu-west-1) 002172820271.dkr.ecr.eu-west-1.amazonaws.com/auth
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 002172820271.dkr.ecr.eu-west-1.amazonaws.com/auth

docker push 002172820271.dkr.ecr.eu-west-1.amazonaws.com/auth:0.1.5
