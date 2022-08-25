import React, {useEffect, useState} from 'react';
import s from "./App.module.scss"
import NumberDisplay from "../components/NumberDisplay";
import {generateCells, openMultipleCells} from "../utils";
import Button from "../components/Button";
import {Cell, CellState, CellValue, Faces} from "../types";

function App() {
    const [cells, setCells] = useState<Cell[][]>(generateCells())
    const [face, setFace] = useState<Faces>(Faces.smile)
    const [time, setTime] = useState<number>(0)
    const [isLive, setIsLive] = useState<boolean>(false)
    const [bombCounter, setBombCounter] = useState<number>(10)
    const [lost, setLost] = useState<boolean>(false)

    useEffect(() => {
        const handleKeyDown = (): void => {
            setFace(Faces.oFave)
        }
        const handleMouseUp = (): void => {
            setFace(Faces.smile)
        }

        window.addEventListener("mousedown", handleKeyDown)
        window.addEventListener("mouseup", handleMouseUp)

        return () => {
            window.removeEventListener("mousedown", handleKeyDown)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [])

    useEffect(() => {
        if (isLive && time < 999) {
            const timer = setInterval(() => {
                setTime((prev: number) => prev + 1)
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [isLive])


    useEffect(() => {
        if (lost) {
            setFace(Faces.lostFace)
            setIsLive(false)
        }
    },[lost])


    const onHandleContext = (
        rowParam: number,
        colParam: number
    ) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.preventDefault()

        if (!isLive) return;

        const currentCells = cells.slice()
        const currentCell = cells[rowParam][colParam]

        if (currentCell.state === CellState.visible) {
            return
        } else if (currentCell.state === CellState.open) {
            currentCells[rowParam][colParam].state = CellState.flagged
            setCells(currentCells)
            if (bombCounter > -99) {
                setBombCounter(prev => prev - 1)
            }
        } else if (currentCell.state === CellState.flagged) {
            currentCells[rowParam][colParam].state = CellState.open
            setCells(currentCells)
            setBombCounter(prev => prev + 1)
        }

    }

    const onHandleCellClick = (rowParam: number, colParam: number) => (): void => {
        if (!isLive) {
            setIsLive(true)
        }
        const currentCell = cells[rowParam][colParam]
        let newCells = cells.slice()

        if ([CellState.flagged, CellState.visible].includes(currentCell.state)) return


        if (currentCell.value === CellValue.bomb ) {
            setLost(true)
            newCells = showAllBombs()
            setCells(newCells)
        } else if (currentCell.value === CellValue.none) {
            newCells = openMultipleCells(newCells, rowParam, colParam)
            setCells(newCells)
        } else {
            newCells[rowParam][colParam].state = CellState.visible
            setCells(newCells)
        }

    }

    const randomCells = (): React.ReactNode => {
        return cells
            .map((row, rowIndex) => row
                .map((cell, colIndex) =>
                    <Button
                        key={`${rowIndex}-${colIndex}`}
                        state={cell.state}
                        value={cell.value}
                        onClick={onHandleCellClick}
                        onContext={onHandleContext}
                        row={rowIndex}
                        col={colIndex}
                    />
                ))
    }

    const onHandleFaceClick = (): void => {
        if (isLive) {
            setIsLive(false)
            setTime(0)
            setCells(generateCells())
            setLost(false)
        }
    }

    const showAllBombs = (): Cell[][] => {
        const currentCells = cells.slice()
        return currentCells.map((row) => row.map((cell) => {
            if (cell.value === CellValue.bomb) {
                return {
                    ...cell,
                    state: CellState.visible
                }
            }
            return  cell
        } ))
    }

    return (
        <main className={s.app}>
            <header className={s.header}>
                <NumberDisplay value={bombCounter}/>
                <div onClick={onHandleFaceClick} className={s.face}>
                    <span role="image" aria-label="face">{face}</span>
                </div>
                <NumberDisplay value={time}/>
            </header>
            <article className={s.body}>
                {randomCells()}
            </article>
        </main>
    );
}

export default App;
