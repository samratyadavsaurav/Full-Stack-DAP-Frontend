import { Banner } from "../components/Banner"
import { Header } from "../components/Header"
import { SpecialityMenu } from "../components/SpecialityMenu"
import { TopDoctors } from "../components/TopDoctors"

export const Home = ()=>{
  return(
    <>
    <Header />
    <SpecialityMenu />
    <TopDoctors />
    <Banner />
    
    </>
  )
}