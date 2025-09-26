import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import {  activateCompany, addCompany, deleteCompany, getAllCompanies, getCompanyById, recentlyRegisteredCompanies, registerCompany, updateCompany,getCompanyByUser} from "../controllers/Company.js";
import upload from "../middleware/uploadMiddleware.js";

const companyRoute = Router();

companyRoute.post('/register', upload.fields([ { name: 'logo', maxCount: 1 } ]),registerCompany);
companyRoute.get('/get', protect, authorize('admin'), getAllCompanies);
companyRoute.get("/getLettestFiveCompanies",protect,authorize("admin"),recentlyRegisteredCompanies);
companyRoute.get('/get/:id', protect, authorize('admin'), getCompanyById);
companyRoute.put("/update", protect, authorize("admin"), upload.fields([{ name: 'logo', maxCount: 1 }]), updateCompany);
companyRoute.delete('/delete/:id', protect, authorize('admin'), deleteCompany);
companyRoute.post('/add', protect, authorize('admin'),  upload.fields([ { name: 'logo', maxCount: 1 } ]), addCompany);
companyRoute.put('/activate/:id', protect, authorize('admin'), activateCompany);
companyRoute.get('/getCompanyByUser' ,protect, authorize('admin','user') ,getCompanyByUser)


export default companyRoute;