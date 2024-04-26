//@ts-nocheck
import {useState} from "react";
import {Calendar, DateObject} from "react-multi-date-picker"
import type {Value} from "react-multi-date-picker"
import {useQuery} from "@tanstack/react-query";
import MentorListItem from "@/containers/scheduleInteview/MentorListItem";
import '../../app/globals.css'
import "react-multi-date-picker/styles/colors/yellow.css"
import {empty} from "@/helper/helper";

const ChooseMentor = () => {
    const [value, setValue] = useState<Value>('');
    const fetchProjects = async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts')
        console.log(res)
        return res.json()
    }
    const { data} = useQuery({
        queryKey: ['todos'],
        queryFn: fetchProjects,
    })
    const now = new DateObject()
    console.log(typeof value)
    return (
        <div className='flex flex-col justify-center w-full items-center'>
            <p className="text-[20px] text-[#F9A826]">{!empty(value) ? value.format("dddd DD MMMM YYYY") : now.format("dddd DD MMMM YYYY")}</p>
            <Calendar className='yellow mt-3' value={value} onChange={setValue}/>
            <div
                className='mentor-scroll-bar overflow-scroll overflow-x-hidden bg-scroll w-full lg:w-4/5 h-[800px] grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 justify-items-center gap-5 mt-10 px-4'>
                {data && data.length > 0 &&
                    data.map((el) => {
                        return <MentorListItem key={el.id} content={el.content} title={el.title}/>
                    })
                }
            </div>
        </div>
    )
}
export default ChooseMentor