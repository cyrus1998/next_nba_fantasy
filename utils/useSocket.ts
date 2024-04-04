import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketReturn {
  socket: Socket | null;
  emitLotterySelect: (user: string, selected: number) => void;
}

const useSocket = (
  url: string, 
  onLotteryReady: (order: string[], timestamp: string) => void, 
  onNextPlay: (user: string, player:string, end:boolean) => void
): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);

  // Function to emit 'lottery-select' event
  const emitLotterySelect = useCallback((user: string, selected: number) => {
    socketRef.current?.emit('lottery-select', user, selected);
  }, []);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(url);

      // Event handlers
      socketRef.current.on('lottery-ready', (order: string[], timestamp: string) => {
        onLotteryReady(order, timestamp);
      });

      socketRef.current.on('next-play', (user: string, player: string, end: boolean) => {
        console.log("use socket hook",user,player)
        onNextPlay(user, player,end);
      });

      // Clean up
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [url, onLotteryReady, onNextPlay]);

  return {
    socket: socketRef.current,
    emitLotterySelect
  };
};

export default useSocket;
