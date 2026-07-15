import { Accordion, Group, Stack, Text } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useState } from 'react'

import { getLocalizedText } from '@shared/utils/config-parser'
import { vibrate } from '@shared/utils/vibrate'

import { IBlockRendererProps } from '../renderer-block.interface'
import classes from './accordion-block.module.css'

export const AccordionBlockRenderer = ({
    blocks,
    isMobile,
    currentLang,
    renderBlockButtons
}: IBlockRendererProps) => {
    // Все шаги раскрыты по умолчанию — инструкцию проходят подряд, прятать шаги незачем
    const [openedAccordions, setOpenedAccordions] = useState<string[]>(() =>
        blocks.map((_, index) => String(index))
    )

    return (
        <Accordion
            chevron={<IconChevronDown size={18} />}
            classNames={{
                item: classes.accordionItem,
                control: classes.accordionControl,
                chevron: classes.accordionChevron,
                content: classes.accordionContent,
                label: classes.accordionLabel
            }}
            multiple
            onChange={(value) => {
                vibrate('tap')
                setOpenedAccordions(value)
            }}
            radius="lg"
            transitionDuration={200}
            value={openedAccordions}
            variant="separated"
        >
            {blocks.map((block, index) => {
                return (
                    <Accordion.Item key={index} value={String(index)}>
                        <Accordion.Control>
                            <Group gap="sm" wrap="nowrap">
                                <span
                                    className={
                                        index === blocks.length - 1
                                            ? `${classes.stepNumber} ${classes.stepNumberAction}`
                                            : classes.stepNumber
                                    }
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                                    <Text
                                        c="dark.8"
                                        dangerouslySetInnerHTML={{
                                            __html: getLocalizedText(block.title, currentLang)
                                        }}
                                        fw={600}
                                        size={isMobile ? 'sm' : 'md'}
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    />
                                </Stack>
                            </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Text
                                c="dark.5"
                                dangerouslySetInnerHTML={{
                                    __html: getLocalizedText(block.description, currentLang)
                                }}
                                size={isMobile ? 'xs' : 'sm'}
                                style={{ lineHeight: 1.7 }}
                            />
                            <Group className={classes.blockButtons} gap="xs" mt="sm" wrap="wrap">
                                {renderBlockButtons(block.buttons, 'light')}
                            </Group>
                        </Accordion.Panel>
                    </Accordion.Item>
                )
            })}
        </Accordion>
    )
}
