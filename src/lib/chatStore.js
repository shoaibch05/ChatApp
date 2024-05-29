import { create } from 'zustand'
import { useUserStore } from './userStore';


export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverUserBlocked: false,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;
    // Check if current user is blocked 
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverUserBlocked: false,
      });
    }
    // Check if receiver is blocked 
    else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverUserBlocked: true,
      });
    }
    else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverUserBlocked: false,
      });
    }
  },
  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
  },

}));