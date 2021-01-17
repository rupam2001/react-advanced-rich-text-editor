import React, { useEffect, useRef, useState } from 'react';
import "./editor.css"

export default function Editor() {

    const textBoxRef = useRef(null)
    const [selectedText, setSelectedText] = useState(null)
    const [selectedTextRange, setSelectedTextRange] = useState({ start: 0, end: 0 })
    const [windowSelection, setWindowSelection] = useState(null)
    const [selectedNode, setSelectedNode] = useState(null)
    const [currentParentsMap, setCurrentParentsMap] = useState({})
    const [text, setText] = useState('')


    useEffect(() => {
        document.addEventListener("keydown", function (event) {

            if (event.ctrlKey && event.keyCode == 66) {
                ApplyBold();
                event.preventDefault();
                event.stopPropagation();
            }


        });
    }, [])


    const ApplyBold = () => {
        if (selectedTextRange.end == selectedTextRange.start) {
            console.log(selectedTextRange.start, selectedTextRange.end)

            replaceWithNode("span", "", "normal", "  ")
            return
        }

        if (selectedNode && selectedNode.getAttribute("ed_id")) {
            let temp = selectedNode;
            while (temp.hasAttribute("ed_id")) {
                if (temp.getAttribute("ed_id") == "bold") {
                    temp.style.removeProperty('font-weight')
                    temp.removeAttribute("ed_id")
                    return;
                }
                temp = temp.parentNode
            }
            replaceWithNode("span", "font-weight:bold;", "bold", selectedText)
        } else {
            replaceWithNode("span", "font-weight:bold;", "bold", selectedText)
        }
    }

    const ApplyItalic = () => {
        // if (selectedTextRange.end == selectedTextRange.start) return
        if (selectedNode && selectedNode.getAttribute("ed_id")) {
            let temp = selectedNode;
            while (temp.hasAttribute("ed_id")) {
                if (temp.getAttribute("ed_id") == "italic") {
                    temp.style.removeProperty('font-style')
                    temp.removeAttribute("ed_id")
                    return;
                }
                temp = temp.parentNode
            }
            replaceWithNode("span", "font-style:italic;", "italic", selectedText)
        } else {
            replaceWithNode("span", "font-style:italic;", "italic", selectedText)
        }
    }
    const ApplyUnderLine = () => {
        // if (selectedTextRange.end == selectedTextRange.start) return
        if (selectedNode && selectedNode.getAttribute("ed_id")) {
            let temp = selectedNode;
            while (temp.hasAttribute("ed_id")) {
                if (temp.getAttribute("ed_id") == "underline") {
                    temp.style.removeProperty('text-decoration')
                    temp.removeAttribute("ed_id")
                    return;
                }
                temp = temp.parentNode
            }
            replaceWithNode("span", "text-decoration:italic;", "underline", selectedText)
        } else {
            replaceWithNode("span", "text-decoration:underline;", "underline", selectedText)
        }
    }
    const ApplyColor = (color) => {
        // if (selectedTextRange.end == selectedTextRange.start) return
        if (selectedNode && selectedNode.getAttribute("ed_id")) {
            let temp = selectedNode;
            while (temp.hasAttribute("ed_id")) {
                if (temp.getAttribute("ed_id") == "colored") {
                    temp.style.removeProperty('color')
                    temp.removeAttribute("ed_id")
                    // return;
                    break;
                }
                temp = temp.parentNode
            }
            replaceWithNode("span", "color:" + color + ";", "colored", selectedText)
        } else {
            replaceWithNode("span", "color:" + color + ";", "colored", selectedText)
        }
    }


    const handleTextChange = (e) => {
        setText(e.target.value)
    }

    const getSelectedText = () => {
        let t = window.getSelection().toString()
        setSelectedText(t)
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

        console.log(node.parentNode)
        setCurrentParentsMap(
            findAllParentNodes(node.parentNode)
        )
    }

    const replaceWithNode = (nodeType, style, edid, content) => {


        let range = windowSelection;

        range?.deleteContents();

        let n = document.createElement(nodeType)
        n.setAttribute("style", style)
        n.setAttribute("ed_id", edid)
        n.innerText = content
        range?.insertNode(n)

    }
    const findAllParentNodes = (node) => {
        let nodeMap = {}
        while (node && node.hasAttribute("ed_id")) {
            nodeMap[node.getAttribute("ed_id")] = true

            node = node.parentNode
        }
        console.log(nodeMap)
        return nodeMap
    }




    return (
        <div className="ed-wrapper">
            <div className="ed-tools">

                <i className={currentParentsMap.hasOwnProperty("bold") ? "fa fa-bold active" : "fa fa-bold"} aria-hidden="true" onClick={ApplyBold} id="bold"></i>

                <i className={currentParentsMap.hasOwnProperty("italic") ? "fa fa-italic active" : "fa fa-italic"} aria-hidden="true" onClick={ApplyItalic} id="italic"></i>
                <i className={currentParentsMap.hasOwnProperty("underline") ? "fa fa-underline active" : "fa fa-underline"} aria-hidden="true" onClick={ApplyUnderLine} id="underline"></i>
                <div class="dropdown">
                    <button class="dropbtn">
                        <i class="fa fa-paint-brush" aria-hidden="true"></i>
                        <i class="fa fa-caret-down"></i>
                    </button>
                    <div class="dropdown-content">
                        {
                            colors.map(c => (
                                <a style={{ color: c }} onClick={() => ApplyColor(c)} >A</a>
                            ))
                        }

                    </div>
                </div>

            </div>
            <div className="ed-main" contentEditable={true} id="ed-main" ref={textBoxRef} onChange={handleTextChange} onMouseUp={getSelectedText} spellCheck="false">
            </div>
        </div>
    )
}


const bold = (text, style) => `<span style="font-weight:bold;${style}" id="bold">${text}</span>`

const colors = [
    "red", "blue", "green", "black", "orange", "purple"
]