import { useState } from "react";

export default function useForm(){
    const [values, setValues] = useState({});

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }
    const get = (name) => {
        if (name in values) return values[name];
        return null;
    }
    const set = (name, value) => {
        setValues({
            ...values,
            [name]: value
        })
    }

    return {
        values, handleChange,
        get,set,
        getAll: () => values,
        setAll: (values) => setValues(values)
    };
}