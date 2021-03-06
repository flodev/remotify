secret_settings( disable_scrub = True )
allow_k8s_contexts('tilt-remotify')
load('ext://helm_remote', 'helm_remote')

dbPassword = '43254SSfsdAA32ds3232sds'

# ------------ postgresql ------------
helm_remote(
  'postgresql',
  repo_url='https://charts.bitnami.com/bitnami',
  set=["auth.database=remotify","auth.postgresPassword=" + dbPassword],
  version=''
)

k8s_resource('postgresql', port_forwards=[5432])

# ------------ hasura ------------

k8s_yaml(
  helm(
    './packages/infra-app/kubernetes/helm/hasura',
    name = 'hasura',
    namespace = '11.1.3',
    values = [],
    set = ["deployment.databaseUrl=postgres://postgres:" + dbPassword + "@postgresql/remotify"]
  )
)
k8s_resource('hasura', port_forwards=[8001], resource_deps=['postgresql'])

# ------------ hasura migrate ------------

k8s_yaml(
  helm(
    './packages/infra-app/kubernetes/helm/hasura-migrate',
    name = 'hasura-migrate'
  )
)
k8s_resource('hasura-migrate', resource_deps=['hasura', 'postgresql'])
docker_build('hasura-migrate', './packages/hasura-migrate')


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
k8s_resource('auth', port_forwards=[4000, 4001], resource_deps=['hasura-migrate', 'hasura', 'postgresql'])
docker_build('auth', './packages/auth')

# ------------ app ------------

# k8s_yaml(
#   helm(
#     './packages/infra-app/kubernetes/helm/app',
#     name = 'app'
#   )
# )

# docker_build('app', './packages/app')
# k8s_resource('app',
#   port_forwards=3001,
#   resource_deps=['auth', 'hasura-migrate', 'hasura', 'postgresql'],
#   trigger_mode=TRIGGER_MODE_MANUAL
# )
