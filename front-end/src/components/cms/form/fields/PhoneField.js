"use client";
import { Input, Form as FormAntd } from "antd";

export default function PhoneField({
  name,
  label,
}) {
   return (
     <FormAntd.Item
       label={label}
       name={name}
       className={`custom-form-item !w-[100%]`}
       labelCol={{ span: 24 }}
     >
       <div className="flex gap-2">
         <Input
           value="+55"
           readOnly
           className="custom-input text-center bg-gray-50 border-gray-200 flex-[0_0_20%] max-w-[80px]"
         />
         <Input className={`custom-input flex-1`} />
       </div>
     </FormAntd.Item>
   );
}