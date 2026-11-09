import { Group, Text } from '@mantine/core'

import { getLocalizedText } from '@shared/utils/config-parser'

import { IBlockRendererProps } from '../renderer-block.interface'
import classes from './accordion-block.module.css'

// Шаги инструкции всегда раскрыты: идут подряд, без карточек, шевронов и номеров
export const AccordionBlockRenderer = ({
    blocks,
    isMobile,
    currentLang,
    renderBlockButtons
}: IBlockRendererProps) => {
    return (
        <div>
            {blocks.map((block, index) => (
                <section className={classes.step} key={index}>
                    <Text
                        c="dark.8"
                        dangerouslySetInnerHTML={{
                            __html: getLocalizedText(block.title, currentLang)
                        }}
                        fw={800}
                        size={isMobile ? 'md' : 'lg'}
                    />
                    <Text
                        c="dark.5"
                        dangerouslySetInnerHTML={{
                            __html: getLocalizedText(block.description, currentLang)
                        }}
                        mt={6}
                        size={isMobile ? 'xs' : 'sm'}
                        style={{ lineHeight: 1.7 }}
                    />
                    <Group className={classes.blockButtons} gap="xs" mt="sm" wrap="wrap">
                        {renderBlockButtons(block.buttons, index === blocks.length - 1 ? 'light' : 'outline')}
                    </Group>
                </section>
            ))}
        </div>
    )
}
