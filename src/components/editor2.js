import React, { useEffect, useRef, useState } from 'react';
import "./editor.css"

export default function Editor({ languages }) {

    const textBoxRef = useRef(null)
    const [selectedText, setSelectedText] = useState(null)
    const [selectedTextRange, setSelectedTextRange] = useState({ start: 0, end: 0 })
    const [windowSelection, setWindowSelection] = useState(null)
    const [selectedNode, setSelectedNode] = useState(null)
    const [currentParentsMap, setCurrentParentsMap] = useState({})
    const [text, setText] = useState('')
    const [selectedTextSize, setSelectedTextSize] = useState(null)

    const [currentCustomeColor, setCurrentCustomeColor] = useState(null)

    const [customColors, setCustomColors] = useState([])

    const [currentLanguage, setCurrentLanguage] = useState({})

    const [currentSuggestion, setCurrentSuggestion] = useState([])

    const [prevText, setPrevText] = useState('')

    const [keyPos, setKeyPos] = useState({ key: "", pos: 0 })

    let _keyPos = { key: "", pos: 0 }

    useEffect(() => {
        textBoxRef.current.addEventListener("keydown", (event) => {

            if (event.ctrlKey && event.keyCode == 66) {
                ApplyBold();
                event.preventDefault();
                event.stopPropagation();
            }

            console.log(currentLanguage)
            if (currentLanguage.hasOwnProperty(event.key)) {

                setCurrentSuggestion(currentLanguage[event.key])
                event.preventDefault()
                let curPos = getCaretIndex(textBoxRef.current)

                const currentAlphaToShow = currentLanguage[event.key][0];

                textBoxRef.current.innerHTML = textBoxRef.current.innerHTML.slice(0, curPos) + currentAlphaToShow + textBoxRef.current.innerHTML.slice(curPos, textBoxRef.current.innerHTML.length - 1)

            } else {
                setCurrentSuggestion([])
            }
        });
        if (languages)
            setCurrentLanguage(languages[0])

    }, [languages])



    const ApplyBold = () => {
        document.execCommand("bold", false, null)
    }
    const ApplyItalic = () => {
        document.execCommand("italic", false, null)
    }
    const ApplyUnderLine = () => {
        document.execCommand("underline", false, null)
    }
    const ApplyColor = (color) => {
        document.execCommand("foreColor", false, color)
    }
    const ApplyHighlighter = (color) => {
        document.execCommand("hiliteColor", false, color)
    }
    const ApplyJustifyCenter = () => {
        document.execCommand("justifyCenter", false, null);
    }

    const ApplyJustifyLeft = () => {
        document.execCommand("justifyLeft", false, null);
    }
    const ApplyUndo = () => {
        document.execCommand("undo", false, null);
    }
    const ApplyRedo = () => {
        document.execCommand("redo", false, null);
    }

    const ApplySizeInc = () => {
        document.execCommand("size", false, "54px");
    }
    const ApplySizeDec = () => {

    }

    const handleTextChange = (e) => {
        let char = e.target.innerHTML
        setText(char)

        const { x, y } = getCaretCoordinates()
        console.log(x, y, "cooords")
    }
    const getSelectedTextSize = (selection) => {
        if (selection) {

            const size = window.getComputedStyle(selection.anchorNode.parentElement, null).getPropertyValue('font-size');
            console.log(size, "size")
            return size
        }
    }
    const getSelectedText = () => {
        let t = window.getSelection().toString()
        setSelectedText(t)

        setSelectedTextSize(getSelectedTextSize(window.getSelection()))

        let start = window.getSelection().anchorOffset;
        let end = window.getSelection().focusOffset;
        if (start > end) {
            let temp = start;
            start = end;
            end = temp;
        }
        setSelectedTextRange({ start, end })
        setWindowSelection(window.getSelection().getRangeAt(0))

        let node = window.getSelection().anchorNode;

        setSelectedNode(node.parentNode)

        setCurrentParentsMap(
            findAllParentNodes(node.parentNode)
        )
    }
    const findAllParentNodes = (node) => {
        let nodeMap = {}
        while (node) {
            nodeMap[node.nodeName] = true
            node = node.parentNode
        }
        return nodeMap
    }


    const addNewCustomeColor = (newColor) => {
        if (customColors.length != 0 && newColor == customColors[customColors.length - 1]) return;
        setCustomColors([...customColors, newColor])
    }



    return (
        <div className="ed-wrapper">
            <div className="ed-tools">
                <button onClick={ApplyBold} className="ed-tool-btn">
                    <i className={currentParentsMap.hasOwnProperty("B") ? "fa fa-bold active" : "fa fa-bold"} aria-hidden="true" id="bold"></i>
                </button>

                <button onClick={ApplyItalic} className="ed-tool-btn">
                    <i className={currentParentsMap.hasOwnProperty("I") ? "fa fa-italic active" : "fa fa-italic"} aria-hidden="true" id="italic"></i>
                </button>

                <button onClick={ApplyUnderLine} className="ed-tool-btn">
                    <i className={currentParentsMap.hasOwnProperty("U") ? "fa fa-underline active" : "fa fa-underline"} aria-hidden="true" id="underline"></i>
                </button>

                <div class="dropdown">
                    <button class="dropbtn">
                        <i class="fa fa-paint-brush" aria-hidden="true"></i>
                        <i class="fa fa-caret-down"></i>
                    </button>
                    <div class="dropdown-content">
                        <div className="ed-custome-colors">
                            {
                                colors.map(c => (
                                    <button onClick={() => ApplyColor(c)} >
                                        <a style={{ color: c }} >A</a>
                                    </button>
                                ))
                            }
                        </div>
                        <div className="ed-tool-color-wrapper">
                            <span>custom</span>
                            <button onClick={() => { }} >
                                <input type="color" className="ed-tool-color-input"
                                    onBlur={(e) => {
                                        addNewCustomeColor(e.target.value)
                                    }} ></input>
                            </button>
                            <div className="ed-custome-colors">
                                {
                                    customColors.map(c => (
                                        <button onClick={() => ApplyColor(c)} >
                                            <a style={{ color: c }} >A</a>
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dropdown">
                    <button class="dropbtn">
                        <i class="fas fa-highlighter"></i>
                        <i class="fa fa-caret-down"></i>
                    </button>
                    <div class="dropdown-content">
                        <div className="ed-custome-colors">
                            {
                                colors.map(c => (
                                    <button className="ed-tools-btn" onClick={() => ApplyHighlighter(c)}>
                                        <i class="fas fa-highlighter" style={{ color: c }}></i>
                                    </button>
                                ))
                            }
                        </div>
                        <div className="ed-tool-color-wrapper">
                            <span>custom</span>
                            <button onClick={() => { }} >
                                <input type="color" className="ed-tool-color-input" onChange={(e) => { setCurrentCustomeColor(e.target.value) }}
                                    onBlur={(e) => {
                                        addNewCustomeColor(e.target.value)
                                    }} ></input>
                            </button>
                            <div className="ed-custome-colors">
                                {
                                    customColors.map(c => (
                                        <button onClick={() => ApplyHighlighter(c)} >
                                            <i className="fa fa-highlighter" style={{ color: c }} ></i>
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>


                <button className="ed-tool-btn" onClick={ApplyJustifyLeft}>
                    <i class="fa fa-align-left" aria-hidden="true"></i>
                </button>
                <button className="ed-tool-btn" onClick={ApplyJustifyCenter}>
                    <i class="fa fa-align-center" aria-hidden="true"></i>
                </button>

                <button className="ed-tool-btn" onClick={ApplyUndo}>
                    <i class="fa fa-undo" aria-hidden="true"></i>
                </button>

                <button className="ed-tool-btn" onClick={ApplyRedo}>
                    <i class="fa fa-redo" aria-hidden="true"></i>
                </button>

                {/* <div className="ed-tools-group">
                    <button className="ed-tool-btn" onClick={ApplySizeDec}>
                        <i class="fa fa-minus" aria-hidden="true"></i>
                    </button>
                    <button className="ed-tool-btn">
                        <i class="fa fa-font" aria-hidden="true"></i>
                    </button>
                    <button className="ed-tool-btn" onClick={ApplySizeInc}>
                        <i class="fa fa-plus" aria-hidden="true"></i>
                    </button>
                </div> */}

            </div>

            <div style={{ position: 'relative' }}>

                <div className="ed-main" innerHTML={text} contentEditable={true} id="ed-main" ref={textBoxRef} onInput={handleTextChange} onMouseUp={getSelectedText} spellCheck="false">
                </div>
                <div className="ed-suggestion">
                    {
                        currentSuggestion.map(alpha => (
                            <span>{alpha}</span>
                        ))
                    }

                </div>
            </div>


        </div>
    )
}


const bold = (text, style) => `<span style="font-weight:bold;${style}" id="bold">${text}</span>`

const colors = [
    "red", "blue", "green", "black", "orange", "purple", "yello", "aqua", "grey", "fuchsia", "gray", "green", "lime", "maroon", "silver", "teal", "olive"
]

const getDifference = (str1, str2) => {
    let smaller = str1.length > str2.length ? str2.length : str1.length
    for (let i = 0; i < smaller; i++) {
        if (str1[i] != str2[i]) return i
    }
    return -1
}


function getCaretCoordinates() {
    let x = 0,
        y = 0;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
        const selection = window.getSelection();
        if (selection.rangeCount !== 0) {
            const range = selection.getRangeAt(0).cloneRange();
            range.collapse(true);
            const rect = range.getClientRects()[0];
            if (rect) {
                x = rect.left;
                y = rect.top;
            }
        }
    }
    return { x, y };
}
function getCaretIndex(element) {
    let position = 0;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
        const selection = window.getSelection();
        if (selection.rangeCount !== 0) {
            const range = window.getSelection().getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            position = preCaretRange.toString().length;
        }
    }
    return position;
}
function setCaret(el, pos) {

    var range = document.createRange()
    var sel = window.getSelection()

    range.setStart(el.childNodes[pos], 5)
    range.collapse(true)

    sel.removeAllRanges()
    sel.addRange(range)
}