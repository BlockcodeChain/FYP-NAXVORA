const AuthModel=({onClose})=>{
    const {userData} = useSelector((state)=>state.user)
    useEffect(()=>{
        if(userData){
          onClose()
        }
    }, [userData,onClose])
    return(
    <div className="fixed insert-0 z-[999] flex items-center justify-center bg-blaack/10 backdrop-blur sm px-4">
      <div classname=absollute top -8 irght5textgray >
        button fatimes
      </div>
      Auth isModel={true}
        </div>

    )
   
}

 export default AuthModel