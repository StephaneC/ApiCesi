
# create a single pod resource
resource "kubernetes_pod" "chatapi-single" {
  metadata {
    name = "chatapi-from-terra"
    labels = {
      app = "chatapi-from-terra"
    }
  }

  spec {
    container {
      image = "docker.io/scastrec/chatapi"
      name  = "chatapi"

      port {
        container_port = 8080
      }
    }
  }
}
# a kubernetes deployment ensure the number of pods 
resource "kubernetes_deployment" "chatapi-deploy" {
  metadata {
    name = "chatapi-deploy"
    labels = {
      app = "chatapi-deploy"
    }
  }

  spec {
    replicas = 3

    selector {
      match_labels = {
        app = "chatapi-deploy"
      }
    }

    template {
      metadata {
        labels = {
            app = "chatapi-deploy"
        }
      }

      spec {
        container {
            image = "docker.io/scastrec/chatapi"
            name  = "chatapi-deploy"

          resources {
            limits {
              cpu    = "0.5"
              memory = "512Mi"
            }
            requests {
              cpu    = "250m"
              memory = "50Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/"
              port = 8080

              http_header {
                name  = "X-Custom-Header"
                value = "Awesome"
              }
            }

            initial_delay_seconds = 3
            period_seconds        = 3
          }
        }
      }
    }
  }
}

# a kube service to expose the single pod created first
resource "kubernetes_service" "nginx" {
  metadata {
    name = "nginx"
  }
  spec {
    selector = {
      app = kubernetes_pod.chatapi-single.metadata[0].labels.app
    }
    port {
      port        = 80
      target_port = 8080
    }

    type = "LoadBalancer"
  }
}


# a kube service to expose the three pods created first
resource "kubernetes_service" "nginx_multi" {
  metadata {
    name = "nginx"
  }
  spec {
    selector = {
      app = kubernetes_deployment.chatapi-deploy.metadata[0].labels.app
    }
    port {
      port        = 80
      target_port = 8080
    }

    type = "LoadBalancer"
  }
}

output "lb_ip" {
  value = kubernetes_service.nginx.load_balancer_ingress[0].ip
}


output "lb_ip_multi" {
  value = kubernetes_service.nginx_multi.load_balancer_ingress[0].ip
}