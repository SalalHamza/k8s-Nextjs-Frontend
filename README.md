<h1 align="center"> Next.js Frontend — Multi-Node Kubernetes Three-Tier Application </h1>

<p align="center">
  <img src="https://img.shields.io/badge/Kubernetes-v1.30-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes" />
  <img src="https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/AWS-EC2-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" />
  <img src="https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="CI/CD" />
</p>

---

## 📌 Architectural Overview

This repository hosts the frontend presentation layer for the Contact Management System. Built with Next.js and React, the client makes direct asynchronous REST API calls to the FastAPI backend microservice running on the cluster.

```
       [ End User Browser ]
                 │
                 ├──► Port 30007 : Loads Next.js UI (HTML / JavaScript)
                 └──► Port 30008 : Sends Async JSON Fetch Calls (POST, GET, PUT, DELETE)
                           │
                           ▼
                 [ Kubernetes Cluster ]
                 ├── NodePort 30007 ──► Frontend Deployment (2 Pods)
                 └── NodePort 30008 ──► Backend Deployment  (2 Pods)
```

---

## ✨ Features

* **Full CRUD Operations:** Add, view, edit, and delete contact details in real-time.
* **Responsive UI:** Clean, responsive design implemented with client-side React hooks (`useState`, `useEffect`).
* **Multi-Stage Docker Packaging:** Minified production image footprint using Node.js 20 Alpine builder and runner stages.
* **High Availability Deployment:** Configured with 2 replicas across Kubernetes worker nodes with automated rolling updates.

---

## 📂 Repository File Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD (Docker Hub push & Master SSH deployment)
├── pages/
│   └── index.js                # Core Contact Management dashboard & client API integration
├── Dockerfile                  # Multi-stage production container build (Alpine)
└── package.json                # Project dependencies (Next.js 14, React 18, React-DOM)
```

---

## 🔌 API Endpoint Configuration

The browser-side code communicates with the backend via the worker node's external IP. Configure this inside `pages/index.js`:

```javascript
const API_BASE = "http://<WORKER_NODE_PUBLIC_IP>:30008";
```

All standard operations route to this endpoint:
* `GET /contacts` — Reads live contacts from PostgreSQL.
* `POST /contacts` — Submits new entries from the UI form.
* `PUT /contacts/{id}` — Updates existing records.
* `DELETE /contacts/{id}` — Removes selected contacts.

---

## 🔒 Automated CI/CD Pipeline

Every code update pushed to the `main` branch triggers `.github/workflows/deploy.yml`:

1. **Multi-Stage Build:** Compiles the Next.js production build and bundles node artifacts into `salalhamza/nextjs-frontend:latest`.
2. **Registry Push:** Authenticates and pushes the image directly to Docker Hub.
3. **Master Deployment via SSH:** Executes remote commands on the AWS Master node:
   ```bash
   kubectl rollout restart deployment/nextjs-frontend -n three-tier-app
   kubectl rollout status deployment/nextjs-frontend -n three-tier-app --timeout=120s
   ```

---

## ⚙️ Required GitHub Repository Secrets

Configure these parameters under **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions**:

* `DOCKERHUB_USERNAME`: Docker Hub registry account name.
* `DOCKERHUB_TOKEN`: Docker Hub Personal Access Token.
* `K8S_MASTER_IP`: AWS EC2 Control Plane public IP.
* `K8S_SSH_USER`: SSH login user (`ubuntu`).
* `K8S_SSH_KEY`: Private SSH key registered on the master node (`~/.ssh/github_deploy`).

---

## 💻 Local Development

```bash
# 1. Clone repository
git clone https://github.com/SalalHamza/k8s-Nextjs-Frontend.git
cd k8s-Nextjs-Frontend

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your web browser.
