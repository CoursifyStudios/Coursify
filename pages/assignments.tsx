import { useRouter } from "next/router";
import { changeTabFocus } from "components/layout/layout.tsx";
import Link from 'next/link'


const Assignment = () => {
    const router = useRouter();
    const { pid } = router.query;
    changeTabFocus(1);
    return (
        
        <p className="text-white"> 
            Assignment: {pid}
        </p>
    )
}

export default Assignment;
// export default function assignments (props) {
//     const router = useRouter();
//     const query = router.query;
//     const number = query.number;

//     return (
//         <div>
//             <h2>
//                 Assignment  <span>{number}</span>
//             </h2>
//         </div>
//     )

// }
