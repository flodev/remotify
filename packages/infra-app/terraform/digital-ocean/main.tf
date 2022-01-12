# define private vpc network
resource "digitalocean_vpc" "remotifyvpc" {
  name     = "remotify-${terraform.workspace}"
  region   = var.do_region
  ip_range = var.do_vpc_cidr
}

# lookup exact version of k8s available
data "digitalocean_kubernetes_versions" "remotify" {
  version_prefix = var.k8s_version_prefix
}

resource "digitalocean_kubernetes_cluster" "k8s" {
  name   = "${var.k8s_cluster_name}-${terraform.workspace}"
  region = var.do_region
  # Grab the latest version slug from `doctl kubernetes options versions`
  version = data.digitalocean_kubernetes_versions.remotify.latest_version

  # network
  vpc_uuid = digitalocean_vpc.remotifyvpc.id

  node_pool {
    name       = "nodepool"
    size       = "s-2vcpu-2gb"
    node_count = 1
  }
}

# Add a CDN endpoint with a custom sub-domain to the Spaces Bucket
# resource "digitalocean_cdn" "remotify-app" {
#   origin           = digitalocean_spaces_bucket.remotifyapp.bucket_domain_name
#   custom_domain    = "meet.remotify.place"
#   certificate_name = digitalocean_certificate.cert.name
# }


# resource "digitalocean_app" "remotify-app" {
#   spec {
#     name   = "remotify-app-${terraform.workspace}"
#     region = var.do_region

#     static_site {
#       name          = "remotify-app-${terraform.workspace}"
#       build_command = "npm install && npm run build"
#       output_dir    = "/build"

#       git {
#         repo_clone_url = "https://github.com/flodev/remotify.git"
#         branch         = "main"
#       }

#       source_dir = "packages/app"
#     }
#   }
# }