import {
    TSubscriptionPageAppConfig,
    TSubscriptionPageButtonConfig,
    TSubscriptionPagePlatformKey
} from '@remnawave/subscription-page-types'
import {
    Box,
    Button,
    ButtonVariant,
    Card,
    Group,
    NativeSelect,
    Stack,
    UnstyledButton
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useClipboard } from '@mantine/hooks'
import { useState } from 'react'
import clsx from 'clsx'

import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useSubscription } from '@entities/subscription-info-store'
import { getIconFromLibrary } from '@shared/utils/config-parser'
import { TemplateEngine } from '@shared/utils/template-engine'
import { useAppConfig } from '@entities/app-config-store'
import { vibrate } from '@shared/utils/vibrate'
import { useTranslation } from '@shared/hooks'

import { IBlockRendererProps } from './components/blocks/renderer-block.interface'
import classes from './installation-guide.module.css'

export type TBlockVariant = 'accordion' | 'cards' | 'minimal' | 'timeline'

interface IProps {
    BlockRenderer: React.ComponentType<IBlockRendererProps>
    hasPlatformApps: Record<TSubscriptionPagePlatformKey, boolean>
    isMobile: boolean
    platform: TSubscriptionPagePlatformKey | undefined
}

export const InstallationGuideConnector = (props: IProps) => {
    const { isMobile, hasPlatformApps, BlockRenderer, platform } = props

    const { t, currentLang, baseTranslations } = useTranslation()

    const { platforms, svgLibrary } = useAppConfig()
    const { copy } = useClipboard({ timeout: 2_000 })
    const subscription = useSubscription()

    const [selectedAppIndex, setSelectedAppIndex] = useState(0)
    const [selectedPlatform, setSelectedPlatform] = useState<TSubscriptionPagePlatformKey>(() => {
        if (platform && hasPlatformApps[platform]) {
            return platform
        }

        const firstAvailable = (
            Object.keys(hasPlatformApps) as TSubscriptionPagePlatformKey[]
        ).find((key) => hasPlatformApps[key])
        return firstAvailable!
    })

    const platformApps = platforms[selectedPlatform]!.apps
    const selectedApp = platformApps[selectedAppIndex] ?? platformApps[0]
    const guideBlocks = selectedApp?.blocks.slice(0, 2) ?? []

    const availablePlatforms = (
        Object.entries(hasPlatformApps) as [TSubscriptionPagePlatformKey, boolean][]
    )
        .filter(([_, hasApps]) => hasApps)
        .map(([platform]) => {
            const platformConfig = platforms[platform]!
            return {
                value: platform,
                label: t(platformConfig.displayName),
                icon: getIconFromLibrary(platformConfig.svgIconKey, svgLibrary)
            }
        })

    const subscriptionUrl = constructSubscriptionUrl(
        window.location.href,
        subscription.user.shortUuid
    )

    const handleButtonClick = (button: TSubscriptionPageButtonConfig) => {
        let formattedUrl: string | undefined

        if (button.type === 'subscriptionLink' || button.type === 'copyButton') {
            formattedUrl = TemplateEngine.formatWithMetaInfo(button.link, {
                username: subscription.user.username,
                subscriptionUrl
            })
        }

        switch (button.type) {
            case 'copyButton': {
                if (!formattedUrl) return

                copy(formattedUrl)
                notifications.show({
                    title: t(baseTranslations.linkCopied),
                    message: t(baseTranslations.linkCopiedToClipboard),
                    color: 'cyan'
                })
                break
            }
            case 'external': {
                window.open(button.link, '_blank')
                break
            }
            case 'subscriptionLink': {
                if (!formattedUrl) return

                window.open(formattedUrl, '_blank')
                break
            }
            default:
                break
        }
    }

    const isAlternativeDownload = (button: TSubscriptionPageButtonConfig) => {
        if (button.type !== 'external') return false

        const downloadPath = button.link.split(/[?#]/)[0]
        const isApk = /\.apk$/i.test(downloadPath)
        const isPortable = /(?:-portable\.zip|\.appimage)$/i.test(downloadPath)
        const isWindowsArm = selectedPlatform === 'windows' && /arm64/i.test(downloadPath)

        return isApk || isPortable || isWindowsArm
    }

    const renderBlockButtons = (
        buttons: TSubscriptionPageButtonConfig[],
        variant: ButtonVariant
    ) => {
        if (buttons.length === 0) return null

        const primaryButtons = buttons.filter((button) => !isAlternativeDownload(button))
        const alternativeButtons = buttons.filter(isAlternativeDownload)

        return (
            <Stack className={classes.blockActions} gap="xs">
                {primaryButtons.length > 0 && (
                    <Group gap="xs" wrap="wrap">
                        {primaryButtons.map((button, index) => (
                            <Button
                                key={index}
                                leftSection={
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: getIconFromLibrary(button.svgIconKey, svgLibrary)
                                        }}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                    />
                                }
                                onClick={() => handleButtonClick(button)}
                                radius="md"
                                variant={variant}
                            >
                                {t(button.text)}
                            </Button>
                        ))}
                    </Group>
                )}
                {alternativeButtons.length > 0 && (
                    <Group gap="md" wrap="wrap">
                        {alternativeButtons.map((button, index) => (
                            <a
                                className={classes.alternativeLink}
                                href={button.link}
                                key={index}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                {t(button.text)}
                            </a>
                        ))}
                    </Group>
                )}
            </Stack>
        )
    }

    const getIcon = (iconKey: string) => getIconFromLibrary(iconKey, svgLibrary)

    return (
        <Card className={classes.guideCard} p={0} radius={0}>
            <Stack gap="md">
                <Group gap="sm" justify="space-between">
                    {availablePlatforms.length > 1 && (
                        <NativeSelect
                            data={availablePlatforms.map((opt) => ({
                                value: opt.value,
                                label: opt.label
                            }))}
                            leftSection={
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: availablePlatforms.find(
                                            (opt) => opt.value === selectedPlatform
                                        )!.icon
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: 20,
                                        height: 20
                                    }}
                                />
                            }
                            onChange={(event) => {
                                vibrate([80])
                                const value = event.target
                                    .value as unknown as TSubscriptionPagePlatformKey
                                setSelectedPlatform(value)
                                setSelectedAppIndex(0)
                            }}
                            radius="md"
                            size="sm"
                            value={selectedPlatform}
                            w={150}
                        />
                    )}
                </Group>

                {platformApps.length > 0 && (
                    <Box>
                        <div className={classes.appsGrid}>
                            {platformApps.map((app: TSubscriptionPageAppConfig, index: number) => {
                                const isActive = index === selectedAppIndex
                                const hasIcon =
                                    (app.name === 'Happ' || app.name === 'INCY') &&
                                    Boolean(app.svgIconKey)

                                return (
                                    <UnstyledButton
                                        className={clsx(
                                            classes.appButton,
                                            isActive && classes.appButtonActive
                                        )}
                                        key={app.name}
                                        onClick={() => {
                                            vibrate('toggle')
                                            setSelectedAppIndex(index)
                                        }}
                                    >
                                        {hasIcon && (
                                            <span
                                                aria-hidden="true"
                                                className={classes.appIcon}
                                                dangerouslySetInnerHTML={{
                                                    __html: getIconFromLibrary(
                                                        app.svgIconKey!,
                                                        svgLibrary
                                                    )
                                                }}
                                            />
                                        )}
                                        <span className={classes.appName}>{app.name}</span>
                                        {app.name === 'INCY' && (
                                            <span className={classes.appBadge}>
                                                <svg
                                                    aria-hidden="true"
                                                    className={classes.appBadgeStar}
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                                советуем
                                            </span>
                                        )}
                                    </UnstyledButton>
                                )
                            })}
                        </div>

                        {selectedApp && (
                            <BlockRenderer
                                blocks={guideBlocks}
                                currentLang={currentLang}
                                getIconFromLibrary={getIcon}
                                isMobile={isMobile}
                                key={`${selectedPlatform}-${selectedAppIndex}`}
                                renderBlockButtons={renderBlockButtons}
                                svgLibrary={svgLibrary}
                            />
                        )}
                    </Box>
                )}
            </Stack>
        </Card>
    )
}
