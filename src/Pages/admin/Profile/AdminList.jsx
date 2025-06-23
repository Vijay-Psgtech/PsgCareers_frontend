import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosInstance';
import DataTable from '../../../Components/Datatable';
import { Container,Typography,MenuItem,Select} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../../Context/AuthContext'

const AdminList = () => {
    const {auth} = useAuth();
    const [adminUsers, setAdminUsers] = useState('');
    const [showModal,setShowModal] = useState(false);
    const [selectedUserId,setSelectedUserId] = useState(null);
    const navigate = useNavigate();

    const columns = [
        {field: "userId", headerName: "Id"},
        {field: "first_name",headerName:"Name"},
        {field: "email",headerName:"Email"},
        {field: "mobile",headerName:"Mobile"},
        {field: "institution",headerName:"Institution"},
    ]

    const fetchAdminUsers = async() => {
        try{
            const res = await axiosInstance.get('/api/admin/getAdminUsers?role=Admin');
            setAdminUsers(res.data);
        } catch(err) {
            console.error("Failed to fetch Admin Users", err);
       }
    }

    const handleDelete = (id) => {
        setSelectedUserId(id);
        setShowModal(true);
    }

    const DeleteUser = async() =>{
        try{
            const res = await axiosInstance.delete(`/api/admin/${selectedUserId}`);
            toast.success(res.data.message);
            setShowModal(false);
            fetchAdminUsers();
        } catch(err) {
            toast.error("Error deleting job");
        }
    }

    useEffect(()=>{
        fetchAdminUsers();
    },[])

    return auth.role !=='superadmin' ? (  <h2 className="p-4 font-bold text-lg">Admin Users List - Restricted Access</h2> ) : (
        <div className='p-6'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-3xl font-bold mb-6">Admin Users Lists </h1>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition" onClick={()=>navigate('/admin-management/create')}>Add admin users</button>
            </div>
            <Container maxWidth={false} 
                disableGutters 
                sx={{ 
                    maxWidth: "1500px", 
                    margin: "0 auto", 
                    overflowX: "auto"
                }}>
                <Typography variant="h5" gutterBottom></Typography>
                <DataTable columns={columns} rows={adminUsers} onDelete={handleDelete} />
            </Container>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-[300px">
                        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-4">Are you sure you want to delete this User</p>
                        <div className="flex justify-end gap-3">
                            <button className="px-4 py-1 bg-gray-200 rounded" onClick={()=>setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="px-4 py-1 bg-red-600 text-white rounded" onClick={DeleteUser}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminList