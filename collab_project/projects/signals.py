from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile, Faculty

@receiver(post_save, sender=User)
def create_user_related_profiles(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)

        if not Faculty.objects.filter(user=instance).exists():
            Faculty.objects.create(user=instance, department="Unknown")
