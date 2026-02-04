## **Project Concept: "Audit-Ready AI" (Enterprise Expense & Audit Microservice)**
You will build a system that processes corporate financial "artifacts" (Invoices, Receipts, and Bank Statements). This allows you to use **MinIO** for storage and **Celery** for heavy lifting without needing a live ticker.

### **The Architecture**

| Component | Role in this Project |
| --- | --- |
| **Django & DRF** | The "Internal Audit" portal. Manages users, departments, and approval workflows. |
| **RabbitMQ** | Decouples the upload from the processing. Ensures the system doesn't lag when 100 receipts are uploaded at once. |
| **Celery** | Triggers OCR (Optical Character Recognition) and AI analysis in the background. |
| **MinIO** | Your "Digital Vault." Stores the original PDFs/Images and the JSON audit results. |
| **AI (Gemini/OpenAI)** | Acts as a "Virtual Auditor." It reads the text and flags suspicious expenses or tax inconsistencies. |
| **Kubernetes** | Handles the orchestration. You can scale the `Celery Worker` pods specifically when there is a backlog of documents to process. |

---

### **Specific Practice Goals**

#### **1. The "Cold Storage" Workflow (MinIO + Celery)**

* **The Task:** A user uploads a 50-page corporate financial report.
* **The Backend:** Django saves the file to **MinIO**. It then sends a message to **RabbitMQ**.
* **The Worker:** A Celery worker picks it up, downloads it from MinIO, and chunks the text. This demonstrates you know how to handle large files without blocking the main thread.

#### **2. AI Auditor (Integrating AI)**

* Don't just summarize. Give the AI a specific financial persona.
* **Prompt:** *"You are a forensic accountant. Look at this invoice. Does the tax ID look valid for this region? Is this $500 'Dinner' expense compliant with a standard $50/day meal policy?"*
* The AI returns a structured JSON (using DRF serializers to validate it) which is then saved to your DB.

#### **3. Kubernetes "Job" Scaling**

* Create a K8s **Horizontal Pod Autoscaler (HPA)**.
* Configure it so that if the **RabbitMQ queue length** exceeds 20 messages, Kubernetes automatically spins up 3 more Celery Worker pods to clear the backlog. **This is a massive "Green Flag" for recruiters.**

---