import uuid
from django.db import models, transaction
from django.db.models import Max

class Chat(models.Model):
    chat_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pass

class ChatMessage(models.Model):
    chat            = models.ForeignKey(Chat, on_delete=models.CASCADE)
    in_chat_order   = models.PositiveIntegerField()
    text            = models.TextField(max_length=10000)

    # Prompts and responses should be ordered per chat
    def save(self, *args, **kwargs):
        if self.in_chat_order is None:
            with transaction.atomic():
                last_number = (ChatMessage.objects.filter(chat=self.chat).aaggregate(Max('in_chat_order'))["in_chat_order__max"])
                self.in_chat_order = (last_number or 0) + 1
        super.save(*args, **kwargs)

class PromptFiles(models.Model):
    chat_message    = models.ForeignKey(ChatMessage, on_delete=models.CASCADE)
    file            = models.FileField()