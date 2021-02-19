import SerialInterface from './serialInterface';
import {Port, Wakeup} from './types';

export type Command = {
  write(): string;
  canSend?(kvm: SerialInterface): boolean;
};

export const ResetBuffer: Command = {
  write(): string {
    return '\n\n\n';
  },
};

export const ListInfoCommand: Command = {
  write(): string {
    return 'k1p0';
  },
};

export function ChangePort(port: Port): Command {
  return {
    write(): string {
      return `ch${port}`;
    },
  };
}

export function SetBuzzer(on: boolean): Command {
  return {
    write(): string {
      return on ? 'buzzon' : 'buzzoff';
    },
  };
}

export function WakeUp(wakeup: Wakeup): Command {
  return {
    write(): string {
      if(wakeup === 'ALL') {
        return 'Wake-Up : DP-ALL';
      }
      return `WAKE-UP : DP-${wakeup}`;
    },
    canSend(kvm: SerialInterface): boolean {
      return kvm.canSendWakeup(wakeup);
    }
  };
}

