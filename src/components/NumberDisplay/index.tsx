import React, {FC} from 'react';
import s from "./NumbersDispaly.module.scss"

interface Props {
    value: number
}

const NumberDisplay: FC<Props> = ({value}) => {
    return (
        <div className={s.root}>{value < 0 ? `-${Math.abs(value).toString().padStart(2, "0")}` : value.toString().padStart(3,  "0")}</div>
    );
};

export default NumberDisplay;