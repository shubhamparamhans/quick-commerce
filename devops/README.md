# Quick Commerce DevOps Guide

## Running Docker Configurations

1. Ensure Docker is installed on your system.
2. Navigate to the root directory of the project.
3. Run the following command to build and start all services:
   ```bash
   docker-compose up --build
   ```
4. Access individual services at their respective ports (e.g., `http://localhost:3001` for `analytics-reporting-service`).

## Running Kubernetes Configurations

1. Ensure `kubectl` and a Kubernetes cluster are set up.
2. Apply the Kubernetes manifests for all services:
   ```bash
   kubectl apply -f devops/kubernetes-manifests.yaml
   ```
3. Verify the deployments and services:
   ```bash
   kubectl get pods
   kubectl get services
   ```
4. Access services via their ingress URLs (e.g., `http://analytics.example.com`).

## Database Backup

- Backups are scheduled as Kubernetes CronJobs.
- MongoDB backups (e.g., `customer-support-service`) are stored in an S3 bucket.
- PostgreSQL backups (e.g., `payment-processing-service`) are also stored in an S3 bucket.
- To manually trigger a backup, run:
  ```bash
  kubectl create job --from=cronjob/<cronjob-name> <job-name>
  ```

## Monitoring and Observability

1. Prometheus and Grafana are deployed in the `monitoring` namespace.
2. Access Prometheus at `http://<prometheus-url>:9090`.
3. Access Grafana at `http://<grafana-url>:3000` (default credentials: `admin/admin`).

## Security Best Practices

- Network policies restrict traffic to namespaces.
- RBAC ensures least privilege access.
- Secrets are managed securely in Kubernetes.