import React, { Fragment, useEffect } from 'react';
import { DataGrid } from "@material-ui/data-grid";
import "./ProductList.css";
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { getAdminProduct, clearErrors, deleteProduct } from '../../actions/productActions';
import MetaData from '../layout/MetaData';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from 'react-alert';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';
import { useNavigate } from 'react-router-dom';
import Loader from "../layout/Loader/Loader";

const ProductList = () => {

    const dispatch = useDispatch();

    const alert = useAlert();

    const navigate = useNavigate();

    const { error, products, loading } = useSelector((state) => state.products);

    const { error: deleteError, isDeleted } = useSelector((state) => state.product); // here error is taken as deleteError becoz there is one more error defined above which is part of products state

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
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
            alert.success("Product Deleted Successfully");
            navigate("/admin/dashboard");
            dispatch({ type: DELETE_PRODUCT_RESET });
        }

        dispatch(getAdminProduct());
    }, [dispatch, alert, error, deleteError, navigate, isDeleted]);

    const columns = [
        {
            field: "id",
            headerName: "Product ID",
            minWidth: 300,
            flex: 0.7,
        },

        {
            field: "name",
            headerName: "Name",
            minWidth: 150,
            flex: 0.5,
        },

        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            minWidth: 150,
            flex: 0.3,
        },

        {
            field: "price",
            headerName: "Price",
            type: "number",
            minWidth: 270,
            flex: 0.5,
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
                        <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>

                        <Button onClick={() => deleteProductHandler(params.getValue(params.id, "id"))}>
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                )
            }
        },
    ];

    const rows = [];

    products && products.forEach((item) => {
        rows.push({
            id: item._id,
            stock: item.Stock,
            price: item.price,
            name: item.name,
        });
    });


    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={`All Products - Admin`} />

                    <div className='dashboard'>
                        <Sidebar />
                        <div className='productListContainer'>
                            <h1 id="productListHeading">ALL PRODUCTS</h1>

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

export default ProductList


