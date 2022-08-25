import React, {FC} from 'react';
import s from "./Button.module.scss"
import {CellState, CellValue} from "../../types";
import clsx from "clsx";

interface Props {
    row: number
    col: number
    state: CellState
    value: CellValue
    onClick(rowParam: number, colParam: number): (...args: any[]) => void
    onContext(rowParam: number, colParam: number): (...args: any[]) => void
}

const Button: FC<Props> = ({col, row, state, value, onContext,onClick}) => {

    const randomContent = (): React.ReactNode => {
        if (state === CellState.visible) {
            if (value === CellValue.bomb) {
                return <span role="image" aria-label="bomb">💣</span>
            } else if (value === CellValue.none) {
                return null
            }
            return value
        } else if (state === CellState.flagged) {
            return <span role="image" aria-label="flag">🚩</span>
        }
        return null
    }

    return (
        <div
            onContextMenu={onContext(row, col)}
            onClick={onClick(row, col)}
            className={clsx(`value-${value}`, s.root, state === CellState.visible ? s.visible : "")}>
            {randomContent()}
        </div>
    );
};

export default Button;