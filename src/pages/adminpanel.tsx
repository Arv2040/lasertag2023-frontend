import "tailwindcss/tailwind.css";
import { getDayOfMonth } from "@/helpers/dateAndTime";
import { Tektur } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import { Chakra_Petch } from "next/font/google";
import { useEffect,useState,useRef } from "react";
import Logout from "@/components/Logout";
import Cookies from "js-cookie";
import { ToastContainer,toast } from "react-toastify";
import axios from "axios";
const tektur = Tektur({ subsets: ["latin"] });
const chakraPetch = Chakra_Petch({ weight: "300", subsets: ["latin"] });
import { getTime } from "@/helpers/dateAndTime";
import Router from "next/router";
import { useRouter } from "next/navigation";
import { checkExpiry } from "@/helpers/checkExpiry";


export default function Adminpanel(){
    const dayOneRef = useRef<HTMLDivElement>(null);
    const router= useRouter()
  const dayTwoRef = useRef<HTMLDivElement>(null);
  const dayThreeRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBookedBy,setShowBookedBy]= useState<boolean>(false)
  const [selectedSlotId, setSelectedSlotId]= useState('');
  const [selectSlotToShow,setSelectSlotToShow]= useState<boolean>(false)
  const [selectDay, setSelectDay] = useState<number>(22);
  const [userData,setUserData]= useState(null)
const [userEmailAssign,setUserEmailAssign] =useState("")
const [userEmailCancel,setUserEmailCancel] =useState("")
const [adminSlotData, setAdminSlotData] = useState([] as any[]);
const [errorMessage,setErrorMessage] =useState<string>("")
const token =Cookies.get('jwtToken')


useEffect(()=>{
  
},[])

useEffect(()=>{
  Cookies.get('jwtToken')
  if(checkExpiry()){
    router.push('/login')
    toast.error("Login Expired")
    return;
  }
  const checkScope=async ()=>{
    try{
      const headers={
          "Authorization":`Bearer ${token}`,
          "Content-Type":"application/json"
      }
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user-info`,{headers})
          if(response.data.scope.trim()!="SUPERADMIN"){
            if(response.data.scope.trim()!="ADMIN"){
            toast.warn('Do not access this route, may cause a ban',{theme:'dark'})
            router.push("/")   
            }   
          }
          setUserData(response.data)
          
  }
  catch(e:any){
      setErrorMessage(e.response.data.error)
  }
  }
checkScope()  
},[]) 

const handleAdminShowSlot=async ()=>{
    try{
        const headers={
            "Authorization":`Bearer ${token}`,
            "Content-Type":"application/json"
        }
        const payload ={
            slotId:selectedSlotId,  
            toShow:!selectSlotToShow
        }
        if(selectedSlotId===''){
            toast.error('Select a slot first',{theme:'dark'})
            
        }
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin-set-slot`,payload,{headers})
        toast.success(response.data.message,{theme:'dark'})
    }
    catch(e:any){
        setErrorMessage(e.response.data.error)
        toast.error(e.response.data.error,{theme:'dark'})
    }
}

const handleAdminAssignSlot= async()=>{
try{
    const headers={
        "Authorization":`Bearer ${token}`
    }
    const payload ={
        email:userEmailAssign,
        slotId:selectedSlotId
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin-assign-slot`,payload,{headers})
    toast.success(response.data.message,{theme:'dark'})
}
catch(e:any){
  console.log(e)
    setErrorMessage(e.response.data.error)
    toast.error(e.response.data.error,{theme:'dark'})
}
}

const handleAdminCancelSlot = async()=>{
    try{
        const headers={
            "Authorization":`Bearer ${token}`
        }
        const payload ={
            email:userEmailCancel,
            
        }
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin-cancel-slot`,payload,{headers})
        toast.success(response.data.message,{theme:'dark'})
    }
    catch(e:any){
         toast.error(e.response.data.message,{theme:'dark'})
        setErrorMessage(e.response.data.message)
        console.log(e)
        
    }
}

useEffect( ()=>{ 
   async function fetchAdminSlot(){
    try{
        const headers={
            'Authorization':`Bearer ${token}`
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin-slot-info
        `,{headers})
        toast.success('Slots fetched successfully',{theme:'dark'})
        setAdminSlotData(response.data)
    }
    catch(e:any){
        const error=e.response.data.message
        console.log(e)
        toast.error(error,{theme:'dark'})
        setErrorMessage(error)
    }
   }
   fetchAdminSlot()
}
,[])

    return (
        <main className="bg-black flex flex-col justify-between items-center gap-[3rem] min-h-screen overflow-x-hidden px-[2rem]">
            <ToastContainer/>
            <Logout/>
            <h1 className={`${chakraPetch.className} text-white text-5xl`}>List Of all Slots </h1>
             <div className="flex flex-row justify-start items-center gap-slotBookDatePadding w-full flex-wrap">
            <div
              className={`bg-slotBookDateColor  ${tektur.className} font-semibold font- text-white rounded-[8px] px-[56px] py-[24px] text-slotBookDateFontSize flex-1 text-center transition-all duration-500 hover:scale-[105%] hover:text-black cursor-pointer`}
              ref={dayOneRef}
              onClick={() => {
                setCurrentPage(1)
                setSelectDay(29);
                dayOneRef.current?.classList.toggle(
                  "bg-slotBookDateColorHover"
                );
                dayTwoRef.current?.classList.remove(
                  "bg-slotBookDateColorHover"
                );
                dayThreeRef.current?.classList.remove(
                  "bg-slotBookDateColorHover"
                );
              }}
            >
              29th February
            </div>
            <div
              className={`bg-slotBookDateColor ${tektur.className} font-semibold font- text-white rounded-[8px] px-[56px] py-[24px] text-slotBookDateFontSize flex-1 text-center transition-all duration-500 hover:scale-[105%] hover:text-black cursor-pointer  `}
              ref={dayTwoRef}
              onClick={() => {
                setShowBookedBy(!showBookedBy)
                setCurrentPage(3)
                setSelectDay(1);
                dayTwoRef.current?.classList.toggle(
                  "bg-slotBookDateColorHover"
                );
                dayOneRef.current?.classList.remove(
                  "bg-slotBookDateColorHover"
                );
                dayThreeRef.current?.classList.remove(
                  "bg-slotBookDateColorHover"
                );
              }}
            >
              1st March 
            </div>
            <div
              className={`bg-slotBookDateColor ${tektur.className} font-semibold font- text-white rounded-[8px] px-[56px] py-[24px] text-slotBookDateFontSize flex-1 text-center transition-all duration-500 hover:scale-[105%] hover:text-black cursor-pointer`}
              ref={dayThreeRef}
              onClick={() => {
                setCurrentPage(7)
               
                setSelectDay(2);
                dayThreeRef.current?.classList.toggle(
                  "bg-slotBookDateColorHover"
                );
                dayOneRef.current?.classList.remove(
                  "bg-slotBookDateColorHover"
                );
                dayTwoRef.current?.classList.remove(
                  "bg-slotBookDateColorHover"
                );
              }}
            >
              2nd March
            </div>
            </div>
            <section className=" grid tab:grid-cols-3 laptopS:grid-cols-4 w-full gap-[10px] ">
                    {adminSlotData.map((slot, index) => {
    console.log(slot)
   if (selectDay == getDayOfMonth(slot.startTime)) {
     return ((
        (  <div
          className={`gap-[14px] bg-slotBookTime ${tektur.className} font-semibold font- rounded-[8px] px-[18px] py-[20px] text-white flex flex-row justify-center items-center cursor-pointer transition-all duration-500 hover:scale-[105%] hover:text-black`}
          key={index} onClick={(event:any)=>{
            setSelectSlotToShow(event.target.dataset.toshow)
            setSelectedSlotId(event.target.dataset.slotid)
            toast.warn(`Slot Selected Day:${getDayOfMonth (slot.startTime)} Time: ${getTime(slot.startTime)}`,{theme:'dark'})
          }}
             
          data-slotid={slot.id} data-toshow={slot.toShow}
        >
            <div className="flex flex-col items-start justify-between gap-[4px]" data-slotid={slot.id} data-toshow={slot.toShow}>
            <div >Carry: <span className={`${slot.isCarry===true?'text-slotBookTimeGreen':'text-slotBookTimeRed'}`}>{slot?.isCarry.toString()}
                </span></div>
             <div>Visible: <span className={`${slot.toShow===true?'text-slotBookTimeGreen':'text-slotBookTimeRed'}`}>{slot?.toShow.toString()}</span></div>
            </div>
          <p data-toshow={slot.toShow} data-slotid={slot.id}>{getTime(slot.startTime)} </p>
          <div
            className="w-[1.5px] h-[20px] bg-white"
            data-slotid={slot.id}
            data-toshow={slot.toShow}
          ></div>
          <p
            className={` ${chakraPetch.className} ${slot?.availability >0 ?'text-slotBookTimeGreen':'text-slotBookTimeRed'}`}
            data-slotid={slot.id}
            data-toshow={slot.toShow}
          >
            {slot?.availability} Slots
          </p>
        </div>)
      ))
   }
 })}
            </section> 
            <section className="flex flex-row justify-center items-center w-full text-white flex-wrap bg-slotBookDateColor rounded-[14px]">
            {
  adminSlotData.map((slot: any, index: number) => (
    (selectedSlotId===slot.id)?(<div key={index} className="flex flex-col justify-center items-center bg-slotBookTime">
    <p className="">
      {`Slot Selected Day:${getDayOfMonth (slot.startTime)} Time: ${getTime(slot.startTime)}`}
    </p>
    {slot.slotBookedBy.map((userDetails: any, index: number) => (
      <div key={index}>
        {userDetails.name}
      </div>
    ))}
  </div>):''
    
  ))
}



            </section>
             {/*Admin Assign slot */}
            <section className="flex flex-col justify-center itmes-center text-white text-4xl w-[75%] gap-[1rem]">
                Assign Above Selected Slot to:
                <input type="text" placeholder="Email of student" className={`${chakraPetch.className} bg-transparent  text-white border-transparent border-[2px] border-white  placeholder-[#222222] rounded-[14px] p-[0.5rem]`} value={userEmailAssign}
                 onChange={(e: any) => {
                    setUserEmailAssign(e.target.value);
                    
                  }}/>
                  <button className={`w-[30%] px-[18px] py-[7px] rounded-[8px]  bg-slotBookTimeRed text-white transition-all duration-500 hover:scale-[105%] hover:text-gray-400 text-xl font-medium`} onClick={()=>{
                    handleAdminAssignSlot();
                  }}>
                    Change Slot 
                  </button>
            </section>
            {/* Cancel Slot for user */}
            <section className="flex flex-col justify-center itmes-center text-white text-4xl w-[75%] gap-[1rem]">
            Cancel Slot for the user:

                <input type="text" placeholder="Email of student" className={`${chakraPetch.className} bg-transparent  text-white border-transparent border-[2px] border-white  placeholder-[#222222] rounded-[14px]  p-[0.5rem]`} value={userEmailCancel}
                 onChange={(e: any) => {
                    setUserEmailCancel(e.target.value);
                  }}/>
                   <button className={`w-[30%] px-[18px] py-[7px] rounded-[8px]  bg-slotBookTimeRed text-white transition-all duration-500 hover:scale-[105%] hover:text-gray-400 text-xl font-medium`} onClick={()=>{
                handleAdminCancelSlot()
            }}>
                    Cancel Slot 
                  </button>
            </section>
             {/* Show Slot for user */}
            <section className="flex flex-col justify-center itmes-center text-white text-4xl w-[75%] gap-[1rem]">
            Show/Hide selected slot for all users:
            <button className={`w-[30%] px-[18px] py-[7px] rounded-[8px]  bg-slotBookTimeRed text-white transition-all duration-500 hover:scale-[105%] hover:text-gray-400 text-xl font-medium`} onClick={()=>{
                handleAdminShowSlot()
            }}>
                    Show/Hide Selected slot
                  </button>
            </section>

        </main>
    )
}