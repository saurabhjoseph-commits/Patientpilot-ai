/**
 * PatientPilot AI
 * Platform Runtime
 * Pipeline
 *
 * Generic middleware pipeline for request processing.
 */

export interface PipelineContext {
  readonly values: Readonly<Record<string, unknown>>;
}

export type PipelineMiddleware<TContext extends PipelineContext> = (
  context: TContext,
  next: () => Promise<void>,
) => Promise<void>;

export interface Pipeline<TContext extends PipelineContext> {
  use(
    middleware: PipelineMiddleware<TContext>,
  ): void;

  execute(
    context: TContext,
  ): Promise<void>;

  clear(): void;
}

export class DefaultPipeline<
  TContext extends PipelineContext,
> implements Pipeline<TContext>
{
  private readonly middlewares: PipelineMiddleware<TContext>[] = [];

  use(
    middleware: PipelineMiddleware<TContext>,
  ): void {
    this.middlewares.push(middleware);
  }

  async execute(
    context: TContext,
  ): Promise<void> {
    const dispatch = async (
      index: number,
    ): Promise<void> => {
      if (index >= this.middlewares.length) {
        return;
      }

      const middleware =
        this.middlewares[index];

      await middleware(
        context,
        async () => {
          await dispatch(index + 1);
        },
      );
    };

    await dispatch(0);
  }

  clear(): void {
    this.middlewares.length = 0;
  }
}

/**
 * Creates a Pipeline instance.
 */
export function createPipeline<
  TContext extends PipelineContext,
>(): Pipeline<TContext> {
  return new DefaultPipeline<TContext>();
}

export default createPipeline;