import { IconAlertCircle, IconCircleCheck, IconWorld } from '@tabler/icons-react'
import { TSubscriptionPagePlatformKey } from '@remnawave/subscription-page-types'
import { Box, Container, Group, Image, Stack, Title } from '@mantine/core'
import { useEffect } from 'react'
import dayjs from 'dayjs'

import {
    AccordionBlockRenderer,
    InstallationGuideConnector,
    SubscriptionKeyWidget,
    SubscriptionLinkWidget
} from '@widgets/main'
import { useAppConfig, useAppConfigStoreActions, useCurrentLang } from '@entities/app-config-store'
import { useSubscription } from '@entities/subscription-info-store'
import { formatDate } from '@shared/utils/config-parser'
import { Page } from '@shared/ui'

import classes from './main.page.module.css'

interface IMainPageComponentProps {
    isMobile: boolean
    platform: TSubscriptionPagePlatformKey | undefined
}

const BYTES_IN_GB = 1024 ** 3
const BYTES_IN_MB = 1024 ** 2

// Остаток трафика: от гигабайта — «12,4 ГБ», меньше — в мегабайтах
const formatTrafficLeft = (bytes: number) => {
    if (bytes >= BYTES_IN_GB) {
        const gb = Math.round((bytes / BYTES_IN_GB) * 10) / 10
        return `${String(gb).replace('.', ',')} ГБ`
    }
    return `${Math.round(bytes / BYTES_IN_MB)} МБ`
}

// Лимит 0 = безлимит
const getTrafficLeftText = (limitBytes: number, usedBytes: number) => {
    if (limitBytes <= 0) return 'Безлимитный трафик'

    const leftBytes = limitBytes - usedBytes
    if (leftBytes <= 0) return 'Трафик закончился'

    return `Ещё ${formatTrafficLeft(leftBytes)} трафика`
}

// Вордмарк как на a4flow.com: строчными, цифры — красным акцентом
const renderWordmark = (name: string) =>
    [...name.toLowerCase()].map((char, i) =>
        /\d/.test(char) ? (
            <span className={classes.brandAccent} key={i}>
                {char}
            </span>
        ) : (
            char
        )
    )

export const MainPageComponent = ({ isMobile, platform }: IMainPageComponentProps) => {
    const config = useAppConfig()
    const currentLang = useCurrentLang()
    const { setLanguage } = useAppConfigStoreActions()
    const subscription = useSubscription()

    useEffect(() => {
        if (currentLang !== 'ru') setLanguage('ru')
    }, [currentLang, setLanguage])

    const brandName = config.brandingSettings.title
    const hasPlatformApps: Record<TSubscriptionPagePlatformKey, boolean> = {
        ios: Boolean(config.platforms.ios?.apps.length),
        android: Boolean(config.platforms.android?.apps.length),
        linux: Boolean(config.platforms.linux?.apps.length),
        macos: Boolean(config.platforms.macos?.apps.length),
        windows: Boolean(config.platforms.windows?.apps.length),
        androidTV: Boolean(config.platforms.androidTV?.apps.length),
        appleTV: Boolean(config.platforms.appleTV?.apps.length)
    }

    const atLeastOnePlatformApp = Object.values(hasPlatformApps).some((value) => value)

    const isActive = subscription.user.userStatus === 'ACTIVE'
    const isLimited = subscription.user.userStatus === 'LIMITED'
    const expiresAt = formatDate(subscription.user.expiresAt, 'ru', config.baseTranslations)
    const isIndefinite = dayjs(subscription.user.expiresAt).year() === 2099
    // В заголовке год лишний — он и так почти всегда текущий
    const expiresAtShort = expiresAt.replace(/,\s*\d{4}$/, '').replace(/^0/, '')
    const trafficLeftText = getTrafficLeftText(
        Number(subscription.user.trafficLimitBytes),
        Number(subscription.user.trafficUsedBytes)
    )

    return (
        <Page>
            <Box className={classes.header}>
                <Container maw={1200} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
                    <Group className={classes.headerInner} justify="space-between">
                        <Group gap="sm" style={{ userSelect: 'none' }} wrap="nowrap">
                            <Image
                                alt="a4flow"
                                className={classes.logo}
                                fit="contain"
                                src="/assets/a4flow-logo.png"
                            />
                            <Title className={classes.brand} order={4}>
                                {renderWordmark(brandName || 'a4vpn')}
                            </Title>
                        </Group>

                        <SubscriptionLinkWidget
                            hideGetLink={config.baseSettings.hideGetLinkButton}
                            supportUrl={config.brandingSettings.supportUrl}
                        />
                    </Group>
                </Container>
            </Box>

            <Container
                className={classes.container}
                maw={1200}
                px={{ base: 'md', sm: 'lg', md: 'xl' }}
                style={{ position: 'relative', zIndex: 1 }}
            >
                <Stack gap={0}>
                    <section className={classes.hero}>
                        <div aria-hidden="true" className={classes.heroAccent} />

                        <div
                            aria-hidden="true"
                            className={isActive ? classes.heroStatus : classes.heroStatusAlert}
                        >
                            {isActive ? (
                                <IconCircleCheck size={40} stroke={1.75} />
                            ) : (
                                <IconAlertCircle size={40} stroke={1.75} />
                            )}
                        </div>

                        <Title className={classes.heroTitle} order={1}>
                            {!isActive && <span>{isLimited ? 'Трафик закончился' : 'Подписка истекла'}</span>}
                            {isActive && isIndefinite && 'Подписка активна'}
                            {isActive && !isIndefinite && (
                                <>
                                    Активна до <span>{expiresAtShort}</span>
                                </>
                            )}
                        </Title>

                        {isActive && trafficLeftText && (
                            <p className={classes.heroSubtitle}>
                                <IconWorld size={18} stroke={1.75} />
                                {trafficLeftText}
                            </p>
                        )}
                    </section>

                    {atLeastOnePlatformApp && (
                        <section className={classes.setup} id="setup">
                            <InstallationGuideConnector
                                BlockRenderer={AccordionBlockRenderer}
                                hasPlatformApps={hasPlatformApps}
                                isMobile={isMobile}
                                platform={platform}
                            />
                        </section>
                    )}

                    <SubscriptionKeyWidget />
                </Stack>
            </Container>
        </Page>
    )
}
