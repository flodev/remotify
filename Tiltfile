secret_settings( disable_scrub = True )
allow_k8s_contexts('tilt-remotify')


load('ext://helm_remote', 'helm_remote')

dbPassword = '43254SSfsdAA32ds3232sds'

# ------------ postgresql ------------
helm_remote(
  'postgresql',
  repo_url='https://charts.bitnami.com/bitnami',
  set=["postgresqlDatabase=remotify","postgresqlPassword=" + dbPassword]
)

# ------------ hasura ------------

k8s_yaml(
  helm(
    './packages/infra-app/kubernetes/helm/hasura',
    name = 'hasura',
    namespace = '' ,
    values = [],
    set = ["deployment.databaseUrl=postgres://postgres:" + dbPassword + "@postgresql/remotify"]
  )
)

# ------------ auth ------------

k8s_yaml(
  helm(
    './packages/infra-app/kubernetes/helm/auth',
    name = 'auth',
    set = [
      "deployment.databaseUrl=postgres://postgres:" + dbPassword + "@postgresql/remotify"
    ]
  )
)

docker_build('auth', './packages/auth')


# k8s_resource('auth', port_forwards=8000,
#     resource_deps=['deploy']
# )