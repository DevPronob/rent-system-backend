# 🚕 Ride Booking System API

A secure, scalable, role-based backend API for a ride booking platform (like Uber or Pathao)

---

##  Project Overview

This system allows:
- Riders to request and cancel rides.
- Drivers to accept/reject rides and update ride statuses.
- Admins to manage users, drivers, and view all rides.

---

## Features

### Authentication & Security
- JWT-based login/logout
- Bcrypt password hashing
- Role-based route protection (Admin, Rider, Driver)

### Rider Features
- Register/login
- Request ride (with pickup/destination)
- Cancel ride (before driver accepts)
- View ride history

### Driver Features
- Register/login with vehicle info
- Admin approval required
- Accept/reject rides
- Set status (Online/Offline)
- Update ride status (Picked Up → In Transit → Completed)
- View earnings history

### Admin Features
- Approve/suspend drivers
- Block/unblock users
- View all users, rides, and drivers

### Ride Lifecycle
- requested → accepted → picked_up → in_transit → completed

---

## Tech Stack

 Technology       Usage                        
----------------- ------------------------------
 Node.js          Runtime                      
 Express.js       Web Framework                
 MongoDB          Database                     
 Mongoose         ODM                          
 TypeScript       Language                    
 Zod              Input validation             
 Bcrypt           Password hashing             
 JSON Web Token   Auth                         
 Postman          API Testing                  

---

## API Endpoints

### Authentication

 Method  Endpoint                Description              
-------- ------------------------ --------------------------
    POST    `/api/v1/auth/register` Register user (all roles)
    POST    `/api/v1/auth/login`    Login and get token  
    GET      `/api/v1/drivers`      Get all drivers (Admin only) 
    GET      `/api/v1/rides`        Get all rides (Admin only)     

---

### User (Admin)

 Method  Endpoint                     Description                 
 -------- ----------------------------- -----------------------------
    GET      `/api/v1/users`               Get all users (Admin only)  
    PATCH    `/api/v1/users/block/:id`     Block a user (Admin only)   
    PATCH    `/api/v1/users/unblock/:id`   Unblock a user              

---

### Driver

 Method  Endpoint                       Description                         
-------- -------------------------------- -------------------------------------
 POST     `/api/v1/drivers/create`      Create Driver                     
 PATCH   `/api/v1/drivers/approve/:id`  Approve driver (Admin only)         
 PATCH   `/api/v1/drivers/suspend/:id`  Suspend driver (Admin only)         
 PATCH   `/api/v1/drivers/:id/status`   Set online/offline (Driver only)    
 GET     `/api/v1/drivers/earnings`     View driver earnings                

---

### Ride

 Method  Endpoint                           Description                              
-------- ----------------------------------- ------------------------------------------
 POST    `/api/v1/rides/request`            Rider requests a ride                    
 PATCH   `/api/v1/rides/:id/cancel`         Rider cancels a ride (if not accepted)   
 PATCH   `/api/v1/rides/:id/accept`         Driver accepts a ride                    
 PATCH   `/api/v1/rides/:id/status`         Driver updates ride status               
 GET     `/api/v1/rides/history/rider`      Rider's ride history                     
 GET     `/api/v1/rides/history/driver`     Driver's ride history                    
 GET     `/api/v1/rides`                    All rides (Admin only)                   

---

## Testing

- Use Postman to test the API endpoints.
- Add JWT token in `Authorization:<token>` header for protected routes.
- A sample flow:
  - Register/login users
  - Approve driver (Admin)
  - Rider requests ride
  - Driver accepts and updates ride status
  - View history and earnings

