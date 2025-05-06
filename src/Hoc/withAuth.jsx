const withAuth  = (WrappedComponent) => {
    return (props)=>{
        console.log("HOC Called");
        const accessToken = localStorage.getItem('accessToken');
        if(!accessToken){
            window.location.replace('/login')
            return null;
        }
        
        return <WrappedComponent {...props}/>
    }
}

export default withAuth;