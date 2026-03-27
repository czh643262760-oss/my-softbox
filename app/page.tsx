"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Sun, Palette, Zap, Sparkles, X } from 'lucide-react';

export default function SuperLightApp() {
  // --- 基础状态定义 ---
  const [view, setView] = useState<'home' | 'flash'>('home'); // 修正：添加了缺失的 view 定义
  const [color, setColor] = useState('#FFFFFF'); 
  const [brightness, setBrightness] = useState(100); 
  const [isFull, setIsFull] = useState(false); 
  const [frostyLevel, setFrostyLevel] = useState(0); 

  // --- 闪烁模式状态 ---
  const [flashSpeed, setFlashSpeed] = useState(0); 
  const [flashColor, setFlashColor] = useState('#ff0000'); 
  const [isFlashing, setIsFlashing] = useState(false);
  const flashIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const presets = [
    { name: '冷白', value: '#FFFFFF' }, { name: '暖黄', value: '#FFD27D' }, 
    { name: '樱花粉', value: '#FFB7C5' }, { name: '天空蓝', value: '#87CEEB' }
  ];

  const frostyEffects = [
    { name: '无', style: { backdropFilter: 'none' } },
    { name: '轻柔', style: { backdropFilter: 'blur(2px) contrast(90%)' } },
    { name: '超柔', style: { backdropFilter: 'blur(8px) contrast(80%)' } },
  ];

  // 闪烁逻辑
  useEffect(() => {
    if (flashIntervalRef.current) clearInterval(flashIntervalRef.current);
    if (view === 'flash' && flashSpeed > 0) {
      flashIntervalRef.current = setInterval(() => {
        setIsFlashing(prev => !prev);
      }, [400, 200, 100][flashSpeed - 1]);
    } else {
      setIsFlashing(false);
    }
    return () => { if (flashIntervalRef.current) clearInterval(flashIntervalRef.current); };
  }, [view, flashSpeed]);

  const currentColor = view === 'home' ? color : (isFlashing ? flashColor : '#000000');

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-between transition-colors duration-200"
         style={{ backgroundColor: currentColor, opacity: brightness / 100 }}>
      
      {/* 柔光层 */}
      {frostyLevel > 0 && (
        <div className="fixed inset-0 z-0 pointer-events-none" style={frostyEffects[frostyLevel].style}></div>
      )}

      {/* 顶部控制 */}
      {!isFull && (
        <div className="w-full p-6 flex justify-between items-center z-10">
          <div className="bg-white/80 px-4 py-2 rounded-full backdrop-blur font-bold text-sm flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-500"/> 柔光灯 Pro
          </div>
          <button onClick={() => setIsFull(true)} className="p-3 bg-white/80 rounded-full backdrop-blur">
            <Palette size={20} />
          </button>
        </div>
      )}

      {/* 全屏点击退出 */}
      {isFull && <div className="fixed inset-0 z-20 cursor-pointer" onClick={() => setIsFull(false)}></div>}

      {/* 控制面板 */}
      {!isFull && (
        <div className="w-full max-w-md bg-white p-6 rounded-t-3xl shadow-2xl space-y-6 z-10">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setView('home')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${view === 'home' ? 'bg-white shadow' : 'text-gray-500'}`}>常规补光</button>
            <button onClick={() => setView('flash')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${view === 'flash' ? 'bg-white shadow' : 'text-gray-500'}`}>闪烁模式</button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold text-gray-400">亮度 <span>{brightness}%</span></div>
            <input type="range" className="w-full h-2 bg-gray-100 rounded-lg accent-yellow-400" value={brightness} onChange={e => setBrightness(parseInt(e.target.value))} />
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-xs font-bold text-gray-400">柔光纸</span>
            {frostyEffects.map((f, i) => (
              <button key={i} onClick={() => setFrostyLevel(i)} className={`px-3 py-1 rounded-full text-xs font-bold ${frostyLevel === i ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>{f.name}</button>
            ))}
          </div>

          {view === 'home' ? (
            <div className="grid grid-cols-4 gap-2">
              {presets.map(p => (
                <button key={p.name} onClick={() => setColor(p.value)} className="h-10 rounded-lg border-2 border-white shadow-sm" style={{ backgroundColor: p.value }}></button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <input type="range" min="0" max="3" step="1" className="w-full accent-red-500" value={flashSpeed} onChange={e => setFlashSpeed(parseInt(e.target.value))} />
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">闪烁颜色 <input type="color" value={flashColor} onChange={e => setFlashColor(e.target.value)} /></div>
            </div>
          )}

          <button onClick={() => setIsFull(true)} className="w-full bg-black text-white py-4 rounded-2xl font-bold">进入全屏模式</button>
        </div>
      )}
    </div>
  );
}