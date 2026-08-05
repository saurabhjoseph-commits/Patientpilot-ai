/**
 * PatientPilot AI
 * Infrastructure Layer
 * Message Bus
 *
 * Provides an abstraction for sending commands and messages
 * to internal or external handlers.
 */

export interface Message<
  TPayload = Readonly<Record<string, unknown>>,
> {
  readonly id: string;
  readonly type: string;
  readonly payload: TPayload;
  readonly createdAt: Date;
}

export type MessageHandler<
  TMessage extends Message = Message,
> = (
  message: TMessage,
) => Promise<void> | void;

export interface MessageBus {
  register(
    type: string,
    handler: MessageHandler,
  ): void;

  send(
    message: Message,
  ): Promise<void>;

  clear(): void;
}

export class DefaultMessageBus
  implements MessageBus
{
  private readonly handlers =
    new Map<string, MessageHandler>();

  register(
    type: string,
    handler: MessageHandler,
  ): void {
    this.handlers.set(type, handler);
  }

  async send(
    message: Message,
  ): Promise<void> {
    const handler =
      this.handlers.get(message.type);

    if (!handler) {
      return;
    }

    await handler(message);
  }

  clear(): void {
    this.handlers.clear();
  }
}

/**
 * Creates a Message Bus.
 */
export function createMessageBus(): MessageBus {
  return new DefaultMessageBus();
}

/**
 * Shared Message Bus.
 */
export const messageBus =
  createMessageBus();

export default messageBus;