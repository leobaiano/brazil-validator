using System;
using System.IO;
using System.Text.Json;
using Xunit;

namespace BrValidator.Tests
{
    /// <summary>
    /// Checks this C# implementation against specification/*/vectors.json,
    /// the language-independent test vectors generated from the TypeScript
    /// implementation. If this passes, the C# port behaves identically to
    /// TypeScript (and to the Go, Python, Java, and Ruby ports) for every
    /// vector on file.
    /// </summary>
    public class ConformanceTests
    {
        private static readonly string SpecDir = Path.GetFullPath(
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "..", "specification"));

        private static JsonElement[] LoadVectors(string name)
        {
            string path = Path.Combine(SpecDir, name, "vectors.json");
            string json = File.ReadAllText(path);
            using JsonDocument doc = JsonDocument.Parse(json);
            JsonElement[] result = new JsonElement[doc.RootElement.GetArrayLength()];
            int i = 0;
            foreach (JsonElement item in doc.RootElement.EnumerateArray())
            {
                result[i++] = item.Clone();
            }
            return result;
        }

        [Fact]
        public void Cpf()
        {
            foreach (JsonElement v in LoadVectors("cpf"))
            {
                string input = v.GetProperty("input").GetString()!;
                Assert.Equal(v.GetProperty("valid").GetBoolean(), BrValidator.Cpf.IsValid(input));
                Assert.Equal(v.GetProperty("normalized").GetString(), BrValidator.Cpf.Normalize(input));
                Assert.Equal(v.GetProperty("formatted").GetString(), BrValidator.Cpf.Format(input));
            }
        }

        [Fact]
        public void Cnpj()
        {
            foreach (JsonElement v in LoadVectors("cnpj"))
            {
                string input = v.GetProperty("input").GetString()!;
                Assert.Equal(v.GetProperty("valid").GetBoolean(), BrValidator.Cnpj.IsValid(input));
                Assert.Equal(v.GetProperty("normalized").GetString(), BrValidator.Cnpj.Normalize(input));
                Assert.Equal(v.GetProperty("formatted").GetString(), BrValidator.Cnpj.Format(input));
            }
        }

        [Fact]
        public void Cep()
        {
            foreach (JsonElement v in LoadVectors("cep"))
            {
                string input = v.GetProperty("input").GetString()!;
                Assert.Equal(v.GetProperty("valid").GetBoolean(), BrValidator.Cep.IsValid(input));
                Assert.Equal(v.GetProperty("normalized").GetString(), BrValidator.Cep.Normalize(input));
                Assert.Equal(v.GetProperty("formatted").GetString(), BrValidator.Cep.Format(input));
            }
        }

        [Fact]
        public void Phone()
        {
            foreach (JsonElement v in LoadVectors("phone"))
            {
                string input = v.GetProperty("input").GetString()!;
                Assert.Equal(v.GetProperty("valid").GetBoolean(), BrValidator.Phone.IsValid(input));
                Assert.Equal(v.GetProperty("normalized").GetString(), BrValidator.Phone.Normalize(input));
                Assert.Equal(v.GetProperty("formatted").GetString(), BrValidator.Phone.Format(input));
            }
        }

        [Fact]
        public void Email()
        {
            foreach (JsonElement v in LoadVectors("email"))
            {
                string input = v.GetProperty("input").GetString()!;
                Assert.Equal(v.GetProperty("valid").GetBoolean(), BrValidator.Email.IsValid(input));
                Assert.Equal(v.GetProperty("normalized").GetString(), BrValidator.Email.Normalize(input));
                Assert.Equal(v.GetProperty("formatted").GetString(), BrValidator.Email.Format(input));
            }
        }

        [Fact]
        public void Pix()
        {
            foreach (JsonElement v in LoadVectors("pix"))
            {
                string input = v.GetProperty("input").GetString()!;
                JsonElement keyTypeElement = v.GetProperty("keyType");
                PixKeyType? wantKeyType = keyTypeElement.ValueKind == JsonValueKind.Null
                    ? (PixKeyType?)null
                    : Enum.Parse<PixKeyType>(keyTypeElement.GetString()!, ignoreCase: true);

                Assert.Equal(wantKeyType, BrValidator.Pix.GetKeyType(input));
                Assert.Equal(v.GetProperty("valid").GetBoolean(), BrValidator.Pix.IsValid(input));
                Assert.Equal(v.GetProperty("normalized").GetString(), BrValidator.Pix.Normalize(input));
                Assert.Equal(v.GetProperty("formatted").GetString(), BrValidator.Pix.Format(input));
            }
        }

        [Fact]
        public void Ie()
        {
            foreach (JsonElement v in LoadVectors("ie"))
            {
                string input = v.GetProperty("input").GetString()!;
                string uf = v.GetProperty("uf").GetString()!;
                Assert.Equal(v.GetProperty("valid").GetBoolean(), BrValidator.Ie.Ie.IsValid(input, uf));
                Assert.Equal(v.GetProperty("normalized").GetString(), BrValidator.Ie.Ie.Normalize(input, uf));
                Assert.Equal(v.GetProperty("formatted").GetString(), BrValidator.Ie.Ie.Format(input, uf));
            }
        }
    }
}
