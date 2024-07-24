import PanelContentChild from "@/containers/panel/PanelContentChild";
import InterviewsItem from "@/containers/panel/InterviewsItem";

const Interviews = () => {
    const fakeData = [
        {id:1,jobPosition : 'Java',dateTo:'2024-07-21 23:45:00',dateFrom:'2024-07-21 23:15:00', mentorName:'Mahdi Tilab'},
        {id:2,jobPosition : 'Java',dateTo:'2024-07-21 23:45:00',dateFrom:'2024-07-21 23:15:00', mentorName:'Mahdi Tilab'},
        {id:3,jobPosition : 'Java',dateTo:'2024-07-21 23:45:00',dateFrom:'2024-07-21 23:15:00', mentorName:'Mahdi Tilab'},
        {id:4,jobPosition : 'Java',dateTo:'2024-07-21 23:45:00',dateFrom:'2024-07-21 23:15:00', mentorName:'Mahdi Tilab'},
        {id:5,jobPosition : 'Java',dateTo:'2024-07-21 23:45:00',dateFrom:'2024-07-21 23:15:00', mentorName:'Mahdi Tilab'},
        {id:6,jobPosition : 'Java',dateTo:'2024-07-21 23:45:00',dateFrom:'2024-07-21 23:15:00', mentorName:'Mahdi Tilab'},
    ]
    return (
        <PanelContentChild>
            <div className='flex flex-col gap-x-8 gap-y-5 lg:gap-y-0 relative'>
                <div>
                    <span className='text-[#F9A826]' >
                        Upcoming Interview
                    </span>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4'>
                        {fakeData.map(data =>{
                            return(
                                <InterviewsItem key={data.id} data={data} />
                            )
                        })}
                    </div>
                    <button className='w-full bg-[#F9A826] text-white p-2 mt-8'>
                        Show More
                    </button>
                </div>
                <div className='mt-10'>
                    <span className='text-[#F9A826]' >
                        Past Interview
                    </span>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4'>
                    {fakeData.map(data =>{
                        return(
                            <InterviewsItem key={data.id} data={data} />
                        )
                    })}
                    </div>
                    <button className='w-full bg-[#F9A826] text-white p-2 mt-8'>
                        Show More
                    </button>
                </div>
            </div>
        </PanelContentChild>
    );
};

export default Interviews;
