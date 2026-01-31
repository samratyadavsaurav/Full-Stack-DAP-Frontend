import {assets} from '../assets/assets';

export const About = () =>{
  return(
    <>
    <div>

      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>ABOUT <span className="text-gray-700 font-medium">US</span></p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-[360px]" src={assets.about_image} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>At DocBridge, we believe in creating a smarter healthcare experience where technology meets trust. Our mission is to bridge the gap between patients and doctors by providing a seamless platform for consultation, appointment booking, and healthcare management. With an intuitive interface and advanced tools, DocBridge makes access to quality healthcare simpler, faster, and more reliable.</p>

          <p>We are driven by innovation, compassion, and a commitment to excellence. Every feature of DocBridge is designed to empower patients with choice, transparency, and convenience, while enabling doctors to reach and serve more people effectively. From managing schedules to connecting with patients, we provide a comprehensive solution that benefits both sides of healthcare.</p>

          <b className="text-gray-800">Our Vision</b>

          <p>At DocBridge, we don’t just connect patients and doctors—we build lasting relationships of care and trust. Our vision is to redefine healthcare accessibility by ensuring that no one has to struggle for expert medical advice. Together, we are building a healthier tomorrow, one appointment at a time.</p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p>Why <span className="text-gray-700 font-semibold">Choose Us</span></p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>EFFICIENCY:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
           <b>CONVENIENCE:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
          </div>

        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>PERSONALIZATION:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>

        </div>


        
      </div>

    </div>
    </>
  )
}