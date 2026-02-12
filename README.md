# Employee Management – Full Stack (Spring Boot + React)

This is a presentation-ready Employee Management project.

## 🔧 Tech Stack
- **Backend:** Spring Boot 3, Spring Web, Spring Data JPA, H2 (default), Swagger UI
- **Frontend:** React + Vite + TailwindCSS + lucide-react icons

## ▶️ How to Run

### 1) Backend
```bash
cd backend
./mvnw spring-boot:run   # if wrapper present, else use: mvn spring-boot:run
```
- Server runs at **http://localhost:8080**
- API Docs: **http://localhost:8080/swagger-ui.html**
- H2 Console: **http://localhost:8080/h2-console** (JDBC URL: `jdbc:h2:mem:emsdb`)

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```
- App runs at **http://localhost:5173**

> CORS is enabled for `http://localhost:5173` in the backend.

## 🌱 Default Data
On first run, the backend seeds 5 employees (Aarav, Priya, Rahul, Neha, Rohan).

## 📁 API (Employees)
- `GET /api/employees` – list all
- `POST /api/employees` – create
- `PUT /api/employees/{empId}` – update by empId
- `DELETE /api/employees/{empId}` – delete by empId

### Employee JSON
```json
{
  "empId": "EMP999",
  "name": "John Doe",
  "email": "john@acme.com",
  "phone": "+91 99999 99999",
  "department": "Engineering",
  "role": "Backend Dev",
  "salary": 850000,
  "doj": "2023-07-18",
  "status": "Active"
}
```

## 🛠 Build Notes
- Default DB is **H2 in-memory** so it's easy to run.
- To use MySQL: add MySQL driver dependency and set datasource in `application.properties`, e.g.
```
spring.datasource.url=jdbc:mysql://localhost:3306/ems
spring.datasource.username=root
spring.datasource.password=yourpass
spring.jpa.hibernate.ddl-auto=update
```
