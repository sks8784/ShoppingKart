import React, { Fragment, useEffect } from 'react';
import { DataGrid } from "@material-ui/data-grid";
import "./ProductList.css";
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import MetaData from '../layout/MetaData';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import Loader from "../layout/Loader/Loader";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from '../../constants/userConstants';


const UsersList = () => {

    const dispatch = useDispatch();

    const alert = useAlert();

    const navigate = useNavigate();

    const { error, users, loading } = useSelector((state) => state.allUsers);

    const { error: deleteError, isDeleted, message } = useSelector((state) => state.profile); 

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success(message);
            navigate("/admin/users");
            dispatch({ type: DELETE_USER_RESET });
        }

        dispatch(getAllUsers());
    }, [dispatch, alert, error, deleteError, navigate, isDeleted, message]);

    const columns = [
        {
            field: "id",
            headerName: "User ID",
            minWidth: 180,
            flex: 0.8,
        },

        {
            field: "email",
            headerName: "Email",
            minWidth: 200,
            flex: 0.5,
        },

        {
            field: "name",
            headerName: "Name",
            // type: "number",
            minWidth: 150,
            flex: 0.5,
        },

        {
            field: "role",
            headerName: "Role",
            // type: "number",
            minWidth: 150,
            flex: 0.3,
            cellClassName: (params) => {
                return params.getValue(params.id, "role") === "admin"
                    ? "greenColor"
                    : "redColor";
            },
        },

        {
            field: "actions",
            headerName: "Actions",
            type: "number",
            minWidth: 150,
            flex: 0.3,
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>

                        <Button onClick={() => deleteUserHandler(params.getValue(params.id, "id"))}>
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                )
            }
        },
    ];

    const rows = [];

    users && users.forEach((item) => {
        rows.push({
            id: item._id,
            role: item.role,
            email: item.email,
            name: item.name,
        });
    });


    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={`All Users - Admin`} />

                    <div className='dashboard'>
                        <Sidebar />
                        <div className='productListContainer'>
                            <h1 id="productListHeading">ALL USERS</h1>

                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={10}
                                disableSelectionOnClick
                                className='productListTable'
                                autoHeight
                            />

                        </div>
                    </div>

                </Fragment>
            )}
        </Fragment>
    )
}


export default UsersList
