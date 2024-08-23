import React, { useState, useEffect, useRef, useCallback } from 'react'

interface Note {
  id: number
  x: number
  y: number
  text: string
  style: React.CSSProperties
  zIndex: number
  animation: string
  movementAnimation: string
}

const fonts = [
  'Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Verdana', 
  'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 
  'Trebuchet MS', 'Arial Black', 'Impact'
]

const animations = [
  'pop-in', 'slide-in', 'fade-in', 'rotate-in', 'bounce-in'
]

export default function Component() {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [maxZIndex, setMaxZIndex] = useState(1)
  const [titleText, setTitleText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const getRandomStyle = useCallback((): React.CSSProperties => {
    return {
      fontFamily: fonts[Math.floor(Math.random() * fonts.length)],
      fontSize: `${Math.floor(Math.random() * 24 + 12)}px`, // 12px to 36px
      color: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
      fontWeight: `${Math.floor(Math.random() * 800 + 100)}`, // 100 to 900
      fontStyle: Math.random() > 0.5 ? 'italic' : 'normal',
      textDecoration: Math.random() > 0.8 ? 'underline' : 'none', // 20% chance of underline
      textTransform: Math.random() > 0.8 ? 'uppercase' : 'none', // 20% chance of uppercase
      letterSpacing: `${Math.floor(Math.random() * 3) - 1}px`, // -1px to 2px
    }
  }, [])

  const getRandomAnimation = useCallback(() => {
    return animations[Math.floor(Math.random() * animations.length)]
  }, [])

  const getRandomMovement = useCallback(() => {
    const randomId = Math.floor(Math.random() * 1000000)
    return `movement-${randomId}`
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      
      if (currentNote && currentNote.text.trim()) {
        setNotes(prevNotes => [...prevNotes, {
          ...currentNote, 
          animation: getRandomAnimation(),
          movementAnimation: getRandomMovement()
        }])
      }

      const newZIndex = maxZIndex + 1
      setMaxZIndex(newZIndex)
      const newNote = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        text: '',
        style: getRandomStyle(),
        zIndex: newZIndex,
        animation: '',
        movementAnimation: ''
      }
      setCurrentNote(newNote)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [getRandomStyle, maxZIndex, currentNote, getRandomAnimation, getRandomMovement])

  useEffect(() => {
    if (currentNote && inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentNote])

  useEffect(() => {
    const title = "随机字体涂鸦墙"
    let index = 0
    const intervalId = setInterval(() => {
      setTitleText(title.slice(0, index + 1))
      index++
      if (index === title.length) clearInterval(intervalId)
    }, 200)
    return () => clearInterval(intervalId)
  }, [])

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentNote) {
      setCurrentNote({ ...currentNote, text: e.target.value })
    }
  }

  const handleNoteSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentNote && currentNote.text.trim()) {
      setNotes(prevNotes => [...prevNotes, {
        ...currentNote, 
        animation: getRandomAnimation(),
        movementAnimation: getRandomMovement()
      }])
      setCurrentNote(null)
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          <h1 className="text-4xl font-bold text-center py-4 px-6 bg-white bg-opacity-70 rounded-full shadow-lg animate-float">
            {titleText}
            <span className="animate-blink">|</span>
          </h1>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 rounded-full animate-float"
              style={{
                backgroundColor: `hsl(${i * 72}, 70%, 50%)`,
                top: `${Math.sin(i / 5 * Math.PI * 2) * 40}px`,
                left: `${Math.cos(i / 5 * Math.PI * 2) * 100 + 100}px`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 border-8 border-dashed border-gray-300 m-4 rounded-3xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 flex items-center justify-center overflow-hidden">
          <p className="text-white text-sm font-semibold whitespace-nowrap animate-marquee">
            点击任意位置直接输入文字，按回车键或点击新位置确认。可以在已有文字上继续添加。
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 flex items-center justify-center overflow-hidden">
          <p className="text-white text-sm font-semibold whitespace-nowrap animate-marquee">
            点击任意位置直接输入文字，按回车键或点击新位置确认。可以在已有文字上继续添加。
          </p>
        </div>
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-b from-pink-300 via-purple-300 to-indigo-300 flex items-center justify-center overflow-hidden">
          <p className="text-white text-sm font-semibold whitespace-nowrap vertical-text animate-marquee-vertical">
            点击任意位置直接输入文字，按回车键或点击新位置确认。可以在已有文字上继续添加。
          </p>
        </div>
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300 flex items-center justify-center overflow-hidden">
          <p className="text-white text-sm font-semibold whitespace-nowrap vertical-text animate-marquee-vertical">
            点击任意位置直接输入文字，按回车键或点击新位置确认。可以在已有文字上继续添加。
          </p>
        </div>
      </div>
      {notes.map((note) => (
        <div
          key={note.id}
          className={`note absolute ${note.animation}`}
          style={{ 
            left: `${note.x}px`, 
            top: `${note.y}px`, 
            zIndex: note.zIndex,
            animation: `${note.movementAnimation} 20s infinite ease-in-out`,
            ...note.style
          }}
        >
          {note.text}
        </div>
      ))}
      {currentNote && (
        <input
          ref={inputRef}
          type="text"
          value={currentNote.text}
          onChange={handleNoteChange}
          onKeyPress={handleNoteSubmit}
          className="absolute p-1 outline-none bg-transparent"
          style={{ 
            left: `${currentNote.x}px`, 
            top: `${currentNote.y}px`, 
            zIndex: currentNote.zIndex,
            ...currentNote.style
          }}
        />
      )}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee-vertical {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slide-in {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes rotate-in {
          0% { transform: rotate(-360deg) scale(0); opacity: 0; }
          100% { transform: rotate(0) scale(1); opacity: 1; }
        }
        @keyframes bounce-in {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-30px); }
          60% { transform: translateY(-15px); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee-vertical {
          animation: marquee-vertical 20s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 0.7s step-end infinite;
        }
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        .pop-in { animation: pop-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .slide-in { animation: slide-in 0.5s ease-out; }
        .fade-in { animation: fade-in 0.5s ease-in; }
        .rotate-in { animation: rotate-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .bounce-in { animation: bounce-in 0.5s ease; }
        
        ${notes.map(note => `
          @keyframes ${note.movementAnimation} {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
            50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
            75% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
          }
        `).join('\n')}
      `}</style>
    </div>
  )
}