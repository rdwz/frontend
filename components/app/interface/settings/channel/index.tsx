import {
  BiRegularListUl,
  BiSolidCloud,
  BiSolidInfoCircle,
  BiSolidTrash,
} from "solid-icons/bi";

import { Channel } from "revolt.js";

import { useClient } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { TextWithEmoji } from "@revolt/markdown";
import { ColouredText, useTheme } from "@revolt/ui";

import { SettingsConfiguration } from "..";

import Webhooks, { Webhook } from "./Webhooks";

const Config: SettingsConfiguration<Channel> = {
  /**
   * Page titles
   * @param key
   */
  title(key) {
    const t = useTranslation();
    const client = useClient();

    if (key.startsWith("webhooks/")) {
      const webhook = client().channelWebhooks.get(key.substring(9));
      return webhook!.name;
    }

    return t(`app.settings.channel_pages.${key.replaceAll("/", ".")}.title`);
  },

  /**
   * Render the current channel settings page
   */
  render(props, channel) {
    // eslint-disable-next-line solid/reactivity
    const id = props.page();
    const client = useClient();

    if (id?.startsWith("webhooks/")) {
      const webhook = client().channelWebhooks.get(id.substring(9));
      return <Webhook webhook={webhook!} />;
    }

    switch (id) {
      case "webhooks":
        return <Webhooks channel={channel} />;
      default:
        return null;
    }
  },

  /**
   * Generate list of categories / entries for channel settings
   * @returns List
   */
  list(channel) {
    const t = useTranslation();
    const theme = useTheme();

    return {
      entries: [
        {
          title: <TextWithEmoji content={channel.name} />,
          entries: [
            {
              id: "overview",
              icon: <BiSolidInfoCircle size={20} />,
              title: t("app.settings.channel_pages.overview.title"),
            },
            {
              hidden: !channel.havePermission("ManagePermissions"),
              id: "permissions",
              icon: <BiRegularListUl size={20} />,
              title: t("app.settings.channel_pages.permissions.title"),
            },
            {
              hidden: !channel.havePermission("ManageWebhooks"),
              id: "webhooks",
              icon: <BiSolidCloud size={20} />,
              title: t("app.settings.channel_pages.webhooks.title"),
            },
          ],
        },
        {
          hidden: !(
            channel.type !== "Group" && channel.havePermission("ManageChannel")
          ),
          entries: [
            {
              icon: <BiSolidTrash size={20} color={theme!.colours.error} />,
              title: (
                <ColouredText colour={theme!.colours.error}>
                  {t("app.context_menu.delete_channel")}
                </ColouredText>
              ),
            },
          ],
        },
      ],
    };
  },
};

export default Config;

export type ChannelSettingsProps = {
  /**
   * Channel
   */
  channel: Channel;
};
