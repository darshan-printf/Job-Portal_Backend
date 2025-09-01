import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import {  activateCompany, addCompany, deleteCompany, getAllCompanies, getCompanyById, registerCompany, updateCompany} from "../controllers/Company.js";
import upload from "../middleware/uploadMiddleware.js";

const companyRoute = Router();

companyRoute.post('/add', protect, authorize('admin'),  addCompany);

companyRoute.get('/get', protect, authorize('admin'), getAllCompanies);
companyRoute.get('/get/:id', protect, authorize('admin'), getCompanyById);
companyRoute.put('/update/:id', protect, authorize('admin'), updateCompany);
companyRoute.delete('/delete/:id', protect, authorize('admin'), deleteCompany);
companyRoute.get('/activate/:id', protect, authorize('admin'), activateCompany);
companyRoute.post('/register', upload.fields([ { name: 'logo', maxCount: 1 } ]),registerCompany);



export default companyRoute;