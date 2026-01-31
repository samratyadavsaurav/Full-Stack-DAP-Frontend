// import { useContext, useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
// import { RelatedDoctors } from "../components/RelatedDoctors";
// import { toast } from "react-toastify";
// import axios from "axios";

// export const Appointment = () => {
//   const { docId } = useParams();
//   const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
//   const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

//   const navigate = useNavigate();

//   const [docInfo, setDocInfo] = useState(null);
 
//   const [docSlots, setDocSlots] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);
//   const [slotTime, setSlotTime] = useState("");

//   // load docInfo from global doctors list
//   useEffect(() => {
//     const doc = doctors?.find((d) => d._id === docId);
//     setDocInfo(doc || null);
//   }, [doctors, docId]);

//   // helper: round up a Date to the next 30-minute mark
//   const roundUpToNext30 = (date) => {
//     const d = new Date(date);
//     const m = d.getMinutes();
//     if (m === 0 || m === 30) return d;
//     if (m < 30) d.setMinutes(30, 0, 0);
//     else {
//       d.setHours(d.getHours() + 1);
//       d.setMinutes(0, 0, 0);
//     }
//     return d;
//   };

//   // Build slots for 7 days (object shape ensures we always have the date even if no slots)
//   const getAvailableSlots = () => {
//     if (!docInfo) return;

//     const today = new Date();
//     const allSlots = [];

//     for (let i = 0; i < 7; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);
//       // normalize date to midnight so hours are predictable
//       date.setHours(0, 0, 0, 0);

//       const end = new Date(date);
//       end.setHours(21, 0, 0, 0); // clinic closes at 9 PM

//       let start;
//       if (i === 0) {
//         // today: start from rounded current time OR 10:00 whichever is later
//         const now = new Date();
//         if (now >= end) {
//           // clinic already closed for today -> no slots
//           start = new Date(end);
//         } else {
//           const rounded = roundUpToNext30(now);
//           if (rounded.getHours() < 10) {
//             start = new Date(date);
//             start.setHours(10, 0, 0, 0);
//           } else {
//             start = new Date(date);
//             start.setHours(rounded.getHours(), rounded.getMinutes(), 0, 0);
//           }
//         }
//       } else {
//         start = new Date(date);
//         start.setHours(10, 0, 0, 0); // normal day start 10 AM
//       }

//       const timeSlots = [];
//       const temp = new Date(start);
//       while (temp < end) {
//         timeSlots.push({
//           dateTime: new Date(temp),
//           time: temp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),

          
//         });
//         temp.setMinutes(temp.getMinutes() + 30);
//       }

//       allSlots.push({ date, slots: timeSlots });
//     }

//     setDocSlots(allSlots);
//   };



//   // regenerate slots once docInfo is available
//   useEffect(() => {
//     getAvailableSlots();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [docInfo]);

//   // when slots load, ensure slotIndex is in-range and set a sensible default slotTime
//   useEffect(() => {
//     if (!docSlots || docSlots.length === 0) return;
//     // clamp slotIndex
//     setSlotIndex((prev) => Math.min(prev, docSlots.length - 1));
//     // if there's a slot for the current slotIndex, pick its first time
//     const defaultTime = docSlots[slotIndex]?.slots?.[0]?.time || "";
//     setSlotTime(defaultTime);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [docSlots]);

//   // when user changes selected day, if that day has slots select the first slot by default
//   useEffect(() => {
//     const daySlots = docSlots?.[slotIndex]?.slots || [];
//     if (daySlots.length) setSlotTime(daySlots[0].time);
//     else setSlotTime("");
//   }, [slotIndex, docSlots]);

//   const bookAppointment = async () => {
//     if (!token) {
//       toast.warn("Login to book appointment");
//       return navigate("/login");
//     }

//     try {
//       if (!docSlots?.length) {
//         toast.error("No available slots");
//         return;
//       }

//       const dayObj = docSlots[slotIndex];
//       if (!dayObj) {
//         toast.error("Please select a day");
//         return;
//       }

//       const selectedSlot = dayObj.slots.find((s) => s.time === slotTime) || dayObj.slots[0];
//       if (!selectedSlot) {
//         toast.error("Please select a time slot");
//         return;
//       }

//       const date = selectedSlot.dateTime;
//       if (!(date instanceof Date)) {
//         toast.error("Invalid slot");
//         return;
//       }

//       const day = date.getDate();
//       const month = date.getMonth() + 1;
//       const year = date.getFullYear();
//       const slotDate = `${day}_${month}_${year}`;

//       const { data } = await axios.post(
//         `${backendUrl}/api/user/book-appointment`,
//         { docId, slotDate, slotTime },
//         { headers: { token } }
//       );

//       if (data?.success) {
//         toast.success(data.message || "Appointment booked");
//         getDoctorsData?.();
//         navigate("/my-appointments");
//       } else {
//         toast.error(data?.message || "Failed to book appointment");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error?.response?.data?.message || error.message || "Something went wrong");
//     }
//   };

//   if (!docInfo) return <p>Loading...</p>;

//   return (
//     <div>
//       {/* ------------- DOCTOR DETAILS ------------- */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div>
//           <img className="bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
//         </div>

//         <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
//           {/* Doc Info: name, degree, experience */}
//           <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
//             {docInfo.name}
//             <img className="w-5" src={assets.verified_icon} alt="Verified" />
//           </p>
//           <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
//             <p>
//               {docInfo.degree} - {docInfo.speciality}
//             </p>
//             <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
//           </div>

//           {/* Doctor About */}
//           <div>
//             <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
//               About <img src={assets.info_icon} alt="Info" />
//             </p>
//             <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
//           </div>

//           <p className="text-gray-500 font-medium mt-4">
//             Appointment fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
//           </p>
//         </div>
//       </div>

//       {/* ------ Booking Slots ------ */}
//       <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
//         <p>Booking Slots</p>
//         <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
//           {docSlots.length > 0 &&
//             docSlots.map((dayObj, index) => (
//               <div
//                 onClick={() => {
//                   setSlotIndex(index);
//                   // set first slot time for that day (if any)
//                   setSlotTime(dayObj.slots?.[0]?.time || "");
//                 }}
//                 className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
//                   slotIndex === index ? "bg-[#5f6FFF] text-white" : "border border-gray-200"
//                 }`}
//                 key={index}
//               >
//                 <p>{daysOfWeek[dayObj.date.getDay()]}</p>
//                 <p>{dayObj.date.getDate()}</p>
//               </div>
//             ))}
//         </div>

//         <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
//           {docSlots.length > 0 && docSlots[slotIndex]?.slots?.length > 0 ? (
//             docSlots[slotIndex].slots.map((item, index) => (
//               <p
//                 onClick={() => setSlotTime(item.time)}
//                 className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
//                   item.time === slotTime ? "bg-[#5f6FFF] text-white" : "text-gray-400 border border-gray-300"
//                 }`}
//                 key={index}
//               >
//                 {item.time.toLowerCase()}
//               </p>
//             ))
//           ) : (
//             <p className="text-sm text-gray-400">No slots available for this day</p>
//           )}
//         </div>

//         <button onClick={bookAppointment} className="bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6">Book an appointment</button>
//       </div>

//       <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
//     </div>
//   );
// }


import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { RelatedDoctors } from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

export const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]); // <-- already booked slots from backend

  // load docInfo from global doctors list
  useEffect(() => {
    const doc = doctors?.find((d) => d._id === docId);
    setDocInfo(doc || null);
  }, [doctors, docId]);

  // helper: round up a Date to the next 30-minute mark
  const roundUpToNext30 = (date) => {
    const d = new Date(date);
    const m = d.getMinutes();
    if (m === 0 || m === 30) return d;
    if (m < 30) d.setMinutes(30, 0, 0);
    else {
      d.setHours(d.getHours() + 1);
      d.setMinutes(0, 0, 0);
    }
    return d;
  };

  // fetch already booked slots from backend
  const getBookedSlots = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/booked-slots/${docId}`);
      if (data.success) {
        setBookedSlots(data.slots || []);
      }
    } catch (err) {
      console.error("Failed to fetch booked slots", err);
    }
  };

  // Build slots for 7 days
  const getAvailableSlots = () => {
    if (!docInfo) return;

    const today = new Date();
    const allSlots = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(21, 0, 0, 0);

      let start;
      if (i === 0) {
        const now = new Date();
        if (now >= end) {
          start = new Date(end);
        } else {
          const rounded = roundUpToNext30(now);
          if (rounded.getHours() < 10) {
            start = new Date(date);
            start.setHours(10, 0, 0, 0);
          } else {
            start = new Date(date);
            start.setHours(rounded.getHours(), rounded.getMinutes(), 0, 0);
          }
        }
      } else {
        start = new Date(date);
        start.setHours(10, 0, 0, 0);
      }

      const timeSlots = [];
      const temp = new Date(start);
      while (temp < end) {
        const slotTimeStr = temp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const slotDateStr = `${temp.getDate()}_${temp.getMonth() + 1}_${temp.getFullYear()}`;

        const isBooked = bookedSlots.some(
          (s) => s.slotDate === slotDateStr && s.slotTime === slotTimeStr
        );

        timeSlots.push({
          dateTime: new Date(temp),
          time: slotTimeStr,
          isBooked
        });
        temp.setMinutes(temp.getMinutes() + 30);
      }

      allSlots.push({ date, slots: timeSlots });
    }

    setDocSlots(allSlots);
  };

  // regenerate slots after docInfo or bookedSlots change
  useEffect(() => {
    if (docInfo) getAvailableSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docInfo, bookedSlots]);

  // load booked slots initially
  useEffect(() => {
    if (docId) getBookedSlots();
  }, [docId]);

  useEffect(() => {
    if (!docSlots || docSlots.length === 0) return;
    setSlotIndex((prev) => Math.min(prev, docSlots.length - 1));
    const defaultTime = docSlots[slotIndex]?.slots?.find((s) => !s.isBooked)?.time || "";
    setSlotTime(defaultTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docSlots]);

  useEffect(() => {
    const daySlots = docSlots?.[slotIndex]?.slots || [];
    const freeSlot = daySlots.find((s) => !s.isBooked);
    if (freeSlot) setSlotTime(freeSlot.time);
    else setSlotTime("");
  }, [slotIndex, docSlots]);

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    try {
      const dayObj = docSlots[slotIndex];
      if (!dayObj) {
        toast.error("Please select a day");
        return;
      }

      const selectedSlot = dayObj.slots.find((s) => s.time === slotTime);
      if (!selectedSlot || selectedSlot.isBooked) {
        toast.error("This slot is already booked");
        return;
      }

      const date = selectedSlot.dateTime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data?.success) {
        toast.success(data.message || "Appointment booked");
        getDoctorsData?.();
        getBookedSlots(); // refresh booked slots
        navigate("/my-appointments");
      } else {
        toast.error(data?.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    }
  };

  if (!docInfo) return <p>Loading...</p>;

  return (
    <div>
      {/* ------------- DOCTOR DETAILS ------------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img className="bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="Verified" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About <img src={assets.info_icon} alt="Info" />
            </p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
          </div>
          <p className="text-gray-500 font-medium mt-4">
            Appointment fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* ------ Booking Slots ------ */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking Slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.map((dayObj, index) => (
            <div
              onClick={() => {
                setSlotIndex(index);
                setSlotTime(dayObj.slots?.find((s) => !s.isBooked)?.time || "");
              }}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                slotIndex === index ? "bg-[#5f6FFF] text-white" : "border border-gray-200"
              }`}
              key={index}
            >
              <p>{daysOfWeek[dayObj.date.getDay()]}</p>
              <p>{dayObj.date.getDate()}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots[slotIndex]?.slots?.length > 0 ? (
            docSlots[slotIndex].slots.map((item, index) => (
              <p
                onClick={() => !item.isBooked && setSlotTime(item.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.isBooked
                    ? "bg-gray-300 text-white cursor-not-allowed"
                    : item.time === slotTime
                    ? "bg-[#5f6FFF] text-white"
                    : "text-gray-400 border border-gray-300"
                }`}
                key={index}
              >
                {item.time.toLowerCase()}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-400">No slots available for this day</p>
          )}
        </div>

        <button
          onClick={bookAppointment}
          className="bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6"
        >
          Book an appointment
        </button>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};
