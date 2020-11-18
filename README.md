# ApiCesi
Api for Cesi Android formation

## Docker
To use dockeriez app
`docker build -t scastrec/chatapi .`

Run it on port 8080
`docker run -p 8080:8080 -d scastrec/chatapi`

Open your browser on [localhost:8080](http://localhost:8080)

## Terraform & GKE
1. Construct the docker
2. `gcloud docker -- push scastrec/chatapi`
3. Create cluster > `cd terraform & terraform init & terraform apply`
4. deploy a new pod with kubectl   
```
gcloud container clusters get-credentials <YOUR_CLUSTER_NAME> --region europe-west3
kubectl create deployment chatapi-by-kube --image=docker.io/scastrec/chatapi
// attach loadbalancer
kubectl expose deployment chatapi-by-kube --type=LoadBalancer --port 80 --target-port 8080

```
5. check pods with `kubectl get pods`. Check services with `kubectl get services -w`

*Yeah It runs - Go to the External IP shown in get services*





