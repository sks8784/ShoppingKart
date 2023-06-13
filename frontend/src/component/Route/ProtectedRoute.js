import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
// import { Navigate,Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
// import Profile from '../User/Profile';

// const ProtectedRoute = ({Component:component, ...rest}) => {

//     const {loading,isAuthenticated,user}=useSelector((state)=>state.user);

//   return (
//     <Fragment>
//         {!loading && (
//             <Routes>
//             <Route
//                 {...rest}
//                 render={(props)=>{
//                     if(!isAuthenticated){
//                         return <Navigate to="/login"/>;
//                     }

//                     return <component {...props}/>;
//                 }}
//             />
//             </Routes>
//         )}
//     </Fragment>
//   );
// };


const ProtectedRoute = (props) => {

    const {loading, isAuthenticated, user}=useSelector((state)=>state.user);

  return (
    <Fragment>
        {/* {!loading && (            
                isAuthenticated ? props.element : <Navigate to="/login"/> 
        )} */}

        {/* {!loading && !isAuthenticated || (            
                props.isAdmin==="true" && user.role!=="admin" ? <Navigate to="/login"/> : props.element
        )} */}


        <div>
        {loading === false && (()=>{
          if(isAuthenticated === false){
            <Navigate to="/login"/>
          }

          if(props.isAdmin === true && user.role !== "admin"){
            return <Navigate to="/login"/>
          }

          return props.element
        })()}
        </div>
    </Fragment>
  )
};


export default ProtectedRoute
